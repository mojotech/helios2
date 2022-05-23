# Reference: https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2

class Types::IconIdToNameType < GraphQL::Schema::Scalar
  # rubocop:disable Metrics/CyclomaticComplexity
  def self.coerce_result(value, _ctx)
    case value
    when '01d' then 'clear-day'
    when '01n' then 'clear-night'
    when '02d' then 'partly-cloudy-day'
    when '02n' then 'partly-cloudy-night'
    when '03d', '03n', '04d', '04n' then 'cloudy'
    when '09d', '09n', '10d', '10n' then 'rain'
    when '11d', '11n' then 'rain' # Thunder
    when '13d', '13n' then 'snow'
    when '50d', '50n' then 'fog'
    else 'unknown'
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end
