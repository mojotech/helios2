class WebHooks::GithubController < ApplicationController
  include GithubWebhook::Processor

  protect_from_forgery with: :null_session

  protected def github_pull_request(payload)
    pull_request = payload[:pull_request]
    publish(Event.pull_requests.with_external_id(pull_request[:id]))
  end

  protected def github_push(payload)
    return unless payload[:ref] == 'refs/heads/master'

    payload[:commits].each do |commit|
      publish(Event.commits.with_external_id(commit[:id]))
    end
  end

  private def publish(event_scope)
    event = event_scope.first_or_initialize
    return unless event.new_record?

    event.save!
    Helios2Schema.subscriptions.trigger("eventPublished", {}, event)
  end

  private def webhook_secret(_payload)
    ENV['GITHUB_WEBHOOK_SECRET']
  end
end
