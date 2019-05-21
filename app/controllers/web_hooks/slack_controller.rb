class WebHooks::SlackController < ApplicationController
  protect_from_forgery with: :null_session
  def create
    halt 403, "Invalid Slack verification token: #{params[:token]}" if ENV['SLACK_VERIFICATION_TOKEN'] != params[:token]
    render plain: build_create_response
  end

  def build_create_response
    case params[:type]
    when 'url_verification'
      params[:challenge]
    when 'event_callback'
      slack_event(params, params[:event][:type])
    else
      "Error"
    end
  end

  protected def slack_event(event_callback, type)
    if type == 'message'
      "Add Slack message to db #{publish_event(Event.slack_messages.with_external_id(event_callback[:event_id]))}"
    elsif type == 'app_mention'
      "Add Slack announcement to db #{publish_announcement(event_callback)}"
    else 'Error'
    end
  end

  private def publish_event(event_scope)
    event = event_scope.first_or_initialize
    return unless event.new_record?

    event.save!
    Helios2Schema.subscriptions.trigger("eventPublished", {}, event)
  end

  private def publish_announcement(event_callback)
    announcement = Announcement.create!(parse_announcement(event_callback))
    Helios2Schema.subscriptions.trigger("announcementPublished", {}, announcement)
  end

  private def parse_announcement(event_callback)
    # Ex: "guests: Welcome to Roy and Amanda from Under Armour on May 23rd 2019 at 11:00 am in Providence"
    type, content = event_callback[:event][:text].split(/: /)

    case type
    when 'guests'
      announcement = handle_guests_command(content)
      announcement[:announcement_id] = event_callback[:event_id]
      announcement
    end
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
