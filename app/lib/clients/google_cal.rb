require 'google/apis/calendar_v3'
require 'googleauth'
require 'fileutils'
require 'logger'
module Clients
  class GoogleCal
    def initialize
      scope = 'https://www.googleapis.com/auth/calendar'
      token_cred_uri = 'https://www.googleapis.com/oauth2/v4/token'.freeze
      client_email = ENV['GOOGLE_CLIENT_EMAIL']
      private_key = ENV['GOOGLE_PRIVATE_KEY']
      authorizer = Signet::OAuth2::Client.new(
        token_credential_uri: token_cred_uri,
        audience: token_cred_uri,
        scope: scope,
        issuer: client_email,
        signing_key: OpenSSL::PKey::RSA.new(private_key)
      )
      authorizer.sub = 'jennifer@mojotech.com'
      @service = Google::Apis::CalendarV3::CalendarService.new
      @service.authorization = authorizer
      @service.authorization.fetch_access_token!
    end

    # Get Today's Guests events from now until 5:30pm
    def get_events(calendar_id)
      today = Time.zone.now
      response = @service.list_events(
        calendar_id,
        max_results: 2,
        single_events: true,
        order_by: 'startTime',
        time_min: today.iso8601,
        time_max: Time.parse("17:30", today).iso8601
      )
      Rails.logger.debug 'No upcoming events found' if response.items.empty?
      response
    end
  end
end
