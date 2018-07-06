# rubocop:disable Style/MultilineIfModifier
ForecastIO.configure do |c|
  # rubocop:enable Style/MultilineIfModifier
  c.api_key = ENV['DARK_SKY_API_KEY'] || Rails.application.credentials.dark_sky[:api_key]
end unless Rails.env.test?
