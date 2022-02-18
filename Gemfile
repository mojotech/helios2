source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.9'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.0'
# ActionCable adapter
gem 'redis'
# Use Puma as the app server
gem 'puma', '~> 4.3'
gem 'rack-cors'

gem 'coffee-rails', '~> 4.2'
gem 'sass-rails', '~> 5.0'
gem 'turbolinks', '~> 5'
gem 'uglifier', '>= 1.3.0'

# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

# ActiveRecord extensions
gem 'groupdate'
gem 'tod', '~> 2.2.0'

gem "dotenv-rails", "~> 2.4.0"
gem "faraday"
gem "foreman", "~> 0.84"
gem 'graphiql-rails', group: :development
gem "graphql", "~> 1.8.3"

# github API
gem 'github_webhook', '~> 1.1'

# slack API
gem 'slack-ruby-client'

# bambooHR API
gem 'bamboozled'

# jobs
gem 'sidekiq'
gem 'sidekiq-repeat'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'rspec_junit_formatter'
  gem 'rspec-rails'
  gem 'rubocop'
  gem 'rubocop-rails'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15', '< 4.0'
  gem 'selenium-webdriver'
  # Easy installation and use of chromedriver to run system tests with Chrome
  gem 'chromedriver-helper'
  gem 'timecop'
end

group :development, :test do
  gem 'sqlite3'
end

group :production do
  gem 'activerecord-postgresql-adapter'
  gem 'pg'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# twitter API
gem "twitter", "~> 6.2"

# Calculates sunrise & sunset
gem 'sun'

# Admin interface
gem 'activeadmin'
gem 'devise'
