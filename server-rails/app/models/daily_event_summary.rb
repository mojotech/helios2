class DailyEventSummary < ApplicationRecord
  def self.archive!(event_scope)
    event_scope
      .group(:source)
      .group_by_day(:created_at, series: false)
      .count
      .each do |groups, count|
      DailyEventSummary.create!(
        source: groups[0],
        day: groups[1],
        count: count
      )
    end
    event_scope.delete_all
  end
end
