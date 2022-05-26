namespace :maintain do
  desc "Archives events into daily_event_summaries"
  task events: :environment do
    Event.transaction do
      scope = Event.before_beginning_of_week
      puts "Archiving #{scope.count} events"
      DailyEventSummary.archive!(scope)
    end
  end
end
