require "graphql/rake_task"
GraphQL::RakeTask.new(
  schema_name: "Helios2Schema",
  dependencies: :environment,
  json_outfile: "app/javascript/schema.json"
)
