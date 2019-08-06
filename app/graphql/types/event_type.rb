class Types::EventSourceType < GraphQL::Schema::Enum
  value 'githubPull', 'Github pull request', value: 'github_pull'
  value 'githubCommit', 'Github commit', value: 'github_commit'
  value 'slackMessage', 'Slack message', value: 'slack_message'
end

class Types::EventType < Types::BaseObject
  field "id", ID
  field "external_id", String
  field "source", Types::EventSourceType
  field "created_at", Types::DateTimeType
end
