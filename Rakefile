# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

# Disable migrations
Rake::Task.tasks.each do |t|
  next unless t.name.start_with?("db:migrate")

  t.clear
  t.add_description("DISABLED: Only add and run migrations in phoenix.")
  t.actions << proc { puts "DISABLED: Only add and run migrations in phoenix." }
end
