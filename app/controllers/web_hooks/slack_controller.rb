class WebHooks::SlackController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    is_invalid_token = AppEnv['SLACK_VERIFICATION_TOKEN'] != params[:token]
    halt 403, "Invalid Slack verification token: #{params[:token]}" if is_invalid_token
    render plain: build_create_response
  end

  def build_create_response
    case params[:type]
    when 'url_verification'
      params[:challenge]
    when 'event_callback'
      event = params[:event]
      return "Skipping disallowed event #{event[:subtype]}" unless allow_event?(event)
      result = slack_event(event, event[:type])
      "Add Slack message event to db #{result}"
    else
      "Error"
    end
  end

  def allow_event?(event)
    subtypes = %w[file_comment file_mention file_share me_message message_replied thread_broadcast]
    (event[:type] == 'message' || event[:type] == 'app_mention') &&
      (event[:subtype].nil? || subtypes.include?(event[:subtype]))
  end

  protected def slack_event(event, type)
    case type
    when 'message'
      "Add Slack message to db #{publish_event(Event.slack_messages.with_external_id(event[:event_ts]))}"
    when 'app_mention'
      "Add Slack announcement to db #{publish_announcement(event)}"
    else 'Error'
    end
  end

  private def publish_event(event_scope)
    event = event_scope.first_or_initialize
    return unless event.new_record?

    event.save!
    Helios2Schema.subscriptions.trigger("eventPublished", {}, event)
  end

  private def publish_announcement(event)
    announcement = Announcement.create!(parse_announcement(event))
    Helios2Schema.subscriptions.trigger("announcementPublished", {}, announcement)
    send_slack_message(event[:channel], event[:user], 'The announcement was saved :rocket:')
  rescue StandardError
    send_slack_message(event[:channel], event[:user],
      'I couldn\'t understand that... Try something like this:
      `@Helios guests: Welcome to Roy and Amanda from Under Armour on May 23rd 2019 at 11:00 am in Providence`')
  end

  private def parse_announcement(event)
    # Ex: "<@UXXXXXXX> guests: Welcome to Roy and Amanda from Under Armour on May 23rd 2019 at 11:00 am in Providence"
    if (match = event[:text].match(/(^<\S+>) (\S+) (.*)$/))
      _bot_id, type, content = match.captures
    end
    case type
    when 'guests:'
      announcement = handle_guests_command(content)
      announcement[:announcement_id] = event[:event_ts]
      announcement
    end
  end

  def send_slack_message(channel, user, message)
    require 'net/http'
    require 'uri'
    require 'json'

    uri = URI.parse(AppEnv['SLACK_WEBHOOK_URL'])

    header = { 'Content-Type': 'application/json' }
    text = { 'text': "<@#{user}> #{message}", 'channel': channel.to_s }

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri, header)
    request.body = text.to_json

    http.request(request)
  end

  def handle_guests_command(content)
    content = content.split(/ to | from | on | in /).map(&:strip)
    fields = %i[message people company publish_on location_id]
    announcement = Hash[fields.zip(content)]
    announcement[:location] = Location.find_by(city_name: announcement[:location_id])
    Time.use_zone(announcement[:location][:time_zone]) {
      announcement[:publish_on] = Time.zone.parse(announcement[:publish_on])
    }
    announcement
  end
end
