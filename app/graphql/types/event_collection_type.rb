class Types::EventCountType < Types::BaseObject
  field 'github_pull', Integer
  field 'github_commit', Integer
  field 'slack_message', Integer
end

class Types::EventCollectionType < Types::BaseObject
  field :all, [Types::EventType]

  delegate :all, to: :object

  field :count, Types::EventCountType

  DEFAULT_COUNTS = {
    github_pull: 0,
    github_commit: 0,
    slack_message: 0
  }.with_indifferent_access.freeze

  def count
    object.group(:source).count.reverse_merge!(DEFAULT_COUNTS)
  end
end
