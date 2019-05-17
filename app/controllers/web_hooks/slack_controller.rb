class WebHooks::SlackController < ApplicationController
  protect_from_forgery with: :null_session

  protected def slack_message(event_callback)
    publish(Event.slack_messages.with_external_id(event_callback[:event_id]))
  end

  private def publish(event_scope)
    event = event_scope.first_or_initialize
    return unless event.new_record?

    event.save!
    Helios2Schema.subscriptions.trigger("eventPublished", {}, event)
  end

  def create
    halt 403, "Invalid Slack verification token: #{params[:token]}" if ENV['SLACK_VERIFICATION_TOKEN'] != params[:token]
    render plain: build_create_response
  end

  def build_create_response
    case params[:type]
    when 'url_verification'
      params[:challenge]
    when 'event_callback'
      "Add Slack message event to db #{slack_message(params)}" if params[:event][:type] == 'message'
    else
      "Error"
    end
  end
end
