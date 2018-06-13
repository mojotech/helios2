class WebHooks::GithubController < ApplicationController
  include GithubWebhook::Processor

  protect_from_forgery with: :null_session

  protected def github_pull_request(payload)
    pull_request = payload[:pull_request]
    Event.pull_requests.with_external_id(pull_request[:id]).first_or_create
  end

  protected def github_push(payload)
    return unless payload[:ref] == 'refs/heads/master'

    payload[:commits].each do |commit|
      Event.commits.with_external_id(commit[:id]).first_or_create
    end
  end

  private def webhook_secret(_payload)
    ENV['GITHUB_WEBHOOK_SECRET']
  end
end
