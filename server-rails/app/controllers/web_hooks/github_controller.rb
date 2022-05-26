class WebHooks::GithubController < ApplicationController
  include GithubWebhook::Processor

  protect_from_forgery with: :null_session

  rescue_from NoMethodError, with: :handle_github_web_hook_exception

  protected

  def github_status(_payload)
  end

  def github_pull_request(payload)
    pull_request = payload[:pull_request]
    publish(Event.pull_requests.with_external_id(pull_request[:id]))
  end

  def github_push(payload)
    return unless payload[:ref] == 'refs/heads/master'

    payload[:commits].each do |commit|
      publish(Event.commits.with_external_id(commit[:id]))
    end
  end

  private

  def publish(event_scope)
    event = event_scope.first_or_initialize
    return unless event.new_record?

    event.save!
    Helios2Schema.subscriptions.trigger("eventPublished", {}, event)
  end

  def handle_github_web_hook_exception(exception)
    raise exception unless exception.message =~ /^GithubWebhooksController#\w+ not implemented$/

    head :ok, content_type: 'application/json'
  end

  def webhook_secret(_payload)
    AppEnv['GITHUB_WEBHOOK_SECRET']
  end
end
