# README

The tech stack for this project consists of:
- Rails 5.2 Back end
- webpacker
- graphQL
- React Front end

To use the Rails back end set the environment variables as follows:
- BACKEND_URL=http://localhost:5001
- BACKEND_LANGUAGE=ruby

## Local development with Rails

### Ruby version

MRI 2.6.9

### Installation options

You can either install the deps directly on your box or you can use the Docker support.

## Native

### Getting ready

Prequisites:
- libpq
  - Ubuntu: sudo apt install libpq-dev
  - OSX: brew install libpq && brew link --force libpq
- libsqlite3
  - Ubuntu: sudo apt install sqlite3 libsqlite3-dev
  - OSX: brew install sqlite3 && brew link --force sqlite3
- asdf OR nvm
  - OSX/Ubuntu (asdf): https://asdf-vm.com/guide/getting-started.html#_1-install-dependencies
  - OSX/Ubuntu (nvm): https://github.com/nvm-sh/nvm
- freedesktop mime database
  - Ubuntu: should work out of the box. https://github.com/mimemagicrb/mimemagic#dependencies
  - OSX: brew install shared-mime-info

- Depending on whether asdf or nvm worked for you: `asdf install` OR add the following to your ~/.zshrc after the configuration details for nvm to pin the nodejs version:
  ```shell
  autoload -U add-zsh-hook
  load-nvmrc() {
    if [[ -f .nvmrc && -r .nvmrc ]]; then
      nvm use
    elif [[ $(nvm version) != $(nvm version default)  ]]; then
      echo "Reverting to nvm default version"
      nvm use default
    fi
  }
  add-zsh-hook chpwd load-nvmrc
  load-nvmrc
  ```
- `gem install bundler:2.2.32`
- `gem install pg -v '1.1.3' --source 'https://rubygems.org/'`
- `gem install sqlite3 -v '1.3.13' --source 'https://rubygems.org/'`
- `gem install foreman`
- `bundle install`
- `yarn install`
- `cp .env.sample .env` -- dotenv loads variables from a **.env** in your project's root directory. Fill in env vars where applicable
- Configure Redis:

OSX:
  ```shell
  brew install redis
  redis-server &
  redis-cli CONFIG SET dir /tmp/
  redis-cli CONFIG SET dbfilename temp.rdb
  redis-cli ping  # Should respond with PONG
  rake db:setup
  ```
Ubuntu:
- Update system
  ```shell
  sudo apt update
  ```
- Install redis server
  ```shell
  sudo apt install redis-server
  ```
- Update configuration
  ```shell
  sudo sh -c 'echo "supervised systemd" >> /etc/redis/redis.config'
  ```
- Restart running service
  ```shell
  sudo systemctl restart redis.service
  ```
- Configure and verify redis
  ```shell
  redis-cli CONFIG SET dir /tmp/
  redis-cli CONFIG SET dbfilename temp.rdb
  redis-cli ping  # Should respond with PONG
  rake db:setup
  ```

### Commands for local lint/testing steps:

**NOTE**: cypress tests depend on latest `rake db:seed` and a server running locally

- Ruby-specific code style checker, reports and automaticaly fixes errors
- `bundle exec rubocop`

#### Spin up Rails Console

- have the docker image running in one terminal tab (`docker-compose up`)
- in a second tab run `docker-compose exec web bundle exec rails console`
  - if it gives any errors, try the following command:
    - `docker-compose run web bundle exec rake app:update:bin`

### Production Start up

- `export PATH=<node path>`
- `export PATH=<rails path>`
- ```bash
  RAILS_ENV=production \
      SECRET_KEY_BASE=<some secret> \
      RAILS_SERVE_STATIC_FILES=1 \
      rails s
  ```

### ActiveAdmin User Interface

Use the admin interface to navigate models and edit their parameters. Can be used to alter the displayed wifi and bathroom codes, rearrange and adjust widget screen time, or even delete a traffic cam from view.
- Accessible through http://localhost:3000/admin
- user email: admin@example.com
- password: password

