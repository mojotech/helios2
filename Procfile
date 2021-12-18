release: RAILS_ENV=production bundle exec rake db:migrate assets:precompile && yarn build
web: RAILS_ENV=production bundle exec rails server
worker: RAILS_ENV=production bundle exec sidekiq
