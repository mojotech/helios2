require 'slack-ruby-client'

class WebHooks::SlackAuthController < ApplicationController
  layout false
  SLACK_CONFIG = {
    slack_client_id: AppEnv['SLACK_CLIENT_ID'],
    slack_api_secret: AppEnv['SLACK_API_SECRET'],
    slack_redirect_uri: AppEnv['SLACK_REDIRECT_URI'],
    slack_verification_token: AppEnv['SLACK_VERIFICATION_TOKEN']
  }.freeze

  missing_params = SLACK_CONFIG.select { |_key, value| value.nil? }
  if missing_params.any?
    error_msg = missing_params.keys.join(", ").upcase
    raise "Missing Slack config variables: #{error_msg}"
  end

  BOT_SCOPE = 'bot'.freeze

  def new
    @bot_scope = BOT_SCOPE
    @slack_client_id = SLACK_CONFIG[:slack_client_id]
    @redirect_uri = SLACK_CONFIG[:slack_redirect_uri]
    render
  end

  def create
    client = Slack::Web::Client.new
    begin
      client.oauth_access(
        client_id: SLACK_CONFIG[:slack_client_id],
        client_secret: SLACK_CONFIG[:slack_api_secret],
        redirect_uri: SLACK_CONFIG[:slack_redirect_uri],
        code: params[:code]
      )
      render plain: "Auth succeeded"
    rescue Slack::Web::Api::Error => e
      render plain: "Auth failed. Reason: #{e.message}"
    end
  end
end
