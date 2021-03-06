# Polls deployment sha for subscribed clients
class ShaPollerWorker
  include Sidekiq::Worker
  include Sidekiq::Repeat::Repeatable

  repeat { hourly.minute_of_hour(0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55) }

  def perform
    logger.info "Running sha poll"

    Helios2Schema.subscriptions.trigger(
      "deploymentSha",
      {},
      AppEnv['HEROKU_SLUG_COMMIT'] || "N/A"
    )
  end
end
