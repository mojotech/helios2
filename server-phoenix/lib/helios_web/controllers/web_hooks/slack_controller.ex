defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller
  alias Helios.{Repo, Event, Location, Announcement}

  def handle(conn, params) do
    case params["type"] do
      "url_verification" ->
        send_resp(conn, 200, params["challenge"])

      "event_callback" ->
        event = params["event"]

        unless allow_event?(event) do
          send_resp(conn, 200, "Skipping disallowed event")
        else
          case slack_event(event) do
            {:ok, _} ->
              send_resp(conn, 200, "OK")

            {:error, message} ->
              send_slack_message(event["user"], message)
              send_resp(conn, 200, "OK")
          end
        end

      _ ->
        send_resp(conn, 200, "Invalid request type")
    end
  end

  defp allow_event?(event) do
    subtypes =
      ~w(file_comment file_mention file_share me_message message_replied thread_broadcast)

    (event["type"] == "message" || event["type"] == "app_mention") &&
      (event["subtype"] == nil || Enum.member?(subtypes, event["subtype"]))
  end

  defp slack_event(event) do
    case event["type"] do
      "message" ->
        unless Event
               |> Event.slack_messages()
               |> Event.with_external_id(event["event_ts"])
               |> Repo.exists?() or message_has_mention?(event) do
          Repo.insert!(%Event{
            source: :slack_message,
            external_id: event["event_ts"]
          })
          |> publish_event
        else
          {:ok, "Event Skipped"}
        end

      "app_mention" ->
        case parse_announcement(event) do
          {:ok, announcement} ->
            Repo.insert!(struct(Announcement, announcement)) |> publish_announcement(event)

          {:error, message} ->
            {:error, message}
        end
    end
  end

  defp message_has_mention?(event) do
    Regex.match?(~r/(?<bot_id>^<\S+>) (?<content>.*)$/, event["text"])
  end

  defp publish_event(event) do
    Absinthe.Subscription.publish(
      HeliosWeb.Endpoint,
      event,
      event_published: "all"
    )

    {:ok, "Event Published"}
  end

  defp publish_announcement(announcement, event) do
    Absinthe.Subscription.publish(
      HeliosWeb.Endpoint,
      announcement,
      announcement_published: "new"
    )

    send_slack_message(event["user"], "The announcement was saved :rocket:")
    {:ok, "Announcement Published"}
  end

  defp parse_announcement(event) do
    with command =
           Regex.named_captures(
             ~r/(?<bot_id>^<\S+>) (?<type>\S+) (?<content>.*)$/,
             event["text"]
           ),
         {:valid_command, true} <- {:valid_command, Enum.count(command) === 3},
         {:valid_type, true} <- {:valid_type, Map.fetch!(command, "type") === "guests:"},
         {:announcement_parse, {:ok, announcement}} <-
           {:announcement_parse, handle_guests_command(command["content"])},
         announcement = Map.put(announcement, :announcement_id, event["event_ts"]) do
      {:ok, announcement}
    else
      {_, false} ->
        {:error,
         "I couldn't understand that...\n\nMake sure your command follows this format: `guests: <message> to <people> from <company> on <publish date and time> in <office location>`.\n\n`<publish date and time>` should look like this, `August 23rd 2019 at 09:00 am`, with the full month name, suffix after day, and leading 0 if the hour is a single digit.\n\n`<office location>` should be `Providence` or `Boulder`."}

      {:announcement_parse, {:error, message}} ->
        {:error, message}
    end
  end

  defp send_slack_message(user, message) do
    HTTPoison.post!(
      System.get_env("SLACK_WEBHOOK_URL"),
      %{text: "<@#{user}> #{message}"} |> Jason.encode!(),
      [{"Content-type", "application/json"}],
      []
    )
  end

  defp handle_guests_command(content) do
    fields = ~w(message people company publish_on location_name)a

    with content = String.split(content, ~r/ to | from | on | in /, trim: true),
         {:content_count, true} <- {:content_count, Enum.count(content) === 5},
         announcement = Enum.zip(fields, content) |> Enum.into(%{}),
         {:location_query, location} when location !== nil <-
           {:location_query, Repo.get_by(Location, city_name: announcement.location_name)},
         {:dt_parse, {:ok, publish_on}} <-
           {:dt_parse,
            parse_publish_on(
              announcement.publish_on,
              location.time_zone
            )} do
      {:ok,
       announcement
       |> Map.put(
         :location,
         location
       )
       |> Map.replace(
         :publish_on,
         publish_on
       )}
    else
      {:content_count, false} ->
        {:error,
         "I couldn't understand that...\n\nMake sure your command follows this format: `guests: <message> to <people> from <company> on <publish date and time> in <office location>`.\n\n`<publish date and time>` should look like this, `August 23rd 2019 at 09:00 am`, with the full month name, suffix after day, and leading 0 if the hour is a single digit.\n\n`<office location>` should be `Providence` or `Boulder`."}

      {:location_query, nil} ->
        {:error,
         "I couldn't understand that...\n\nMake sure the office location is either `Providence` or `Boulder`."}

      {:dt_parse, {:error, _message}} ->
        {:error,
         "I couldn't understand that...\n\nThe date and time should look like this, `August 23rd 2019 at 09:00 am`, with the full month name, suffix after day, and leading 0 if the hour is a single digit."}
    end
  end

  defp parse_publish_on(dt, tz) do
    {:ok,
     remove_ordinal_suffix_publish_on(dt)
     |> Timex.parse!("%B %e %Y at %I:%M %p", :strftime)
     |> DateTime.from_naive!(tz)
     |> DateTime.shift_zone!("Etc/UTC")}
  rescue
    e in Timex.Parse.ParseError ->
      {:error, e.message}
  end

  def remove_ordinal_suffix_publish_on(dt) do
    String.replace(dt, ~r/([0-9])(st|nd|rd|th)/, "\\1")
  end
end
