Sidekiq.configure_server do |config|
  config.redis = Rails.application.config_for(:redis)
end

Sidekiq.configure_client do |config|
  config.redis = Rails.application.config_for(:redis)
end

Sidekiq::Repeat.configure do |config|
  config.redlock_redis_instances = [Rails.application.config_for(:redis)['url']]
end
