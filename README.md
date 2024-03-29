# README

The tech stack for this project consists of:
- Rails 5.2 Back end
- or Phoenix 1.6 Back end
- esbuild 
- graphQL
- React Front end

To use the Phoenix back end set the environment variables as follows:
- BACKEND_URL=http://localhost:4000
- BACKEND_LANGUAGE=elixir

To use the Rails back end set the environment variables as follows:
- BACKEND_URL=http://localhost:5001
- BACKEND_LANGUAGE=ruby

## Local development with Phoenix

[View the README] in the server-phoenix directory.

[View the README]: server-phoenix/README.me
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

### Start it up

- `foreman start -f Procfile.development`
- http://localhost:3000

## Docker

### Getting Ready

- Install Docker and docker-compose
- `cp .env.local.sample .env` -- fill in env vars where applicable
- Sign up for a free [OpenWeather API key](https://home.openweathermap.org/api_keys)

  Note: the free API key has a daily limit of 1000 requests

### Start it up

- `docker-compose build`
- `docker-compose up`
- http://localhost:3000

### Commands for local lint/testing steps:

**NOTE**: cypress tests depend on latest `rake db:seed` and a server running locally

- Command prints detected errors, stylistic/formatting issues, and bugs
- `yarn run lint`

- Executes yarn run lint, and makes suggested changes
- `yarn run lint --fix`

- Runs test script as defined by the package
- `yarn run test`

- Runs cypress tests
- `yarn run cy:run`

- Opens cypress test interface
- `yarn run cy:open`

- Ruby-specific code style checker, reports and automaticaly fixes errors
- `bundle exec rubocop`

- While in server-phoenix, dumps the GraphQL schema
- `mix absinthe.schema.json --schema HeliosWeb.Schema --pretty ../app/javascript/`

#### Spin up Rails Console

- have the docker image running in one terminal tab (`docker-compose up`)
- in a second tab run `docker-compose exec web bundle exec rails console`
  - if it gives any errors, try the following command:
    - `docker-compose run web bundle exec rake app:update:bin`

### Integrations

There are a number of integrations used within the Helios app.
A more detailed desctipition of these integrations including how to
get started using them can be found [here](./INTEGRATIONS.md)

### Production Start up

- `export PATH=<node path>`
- `export PATH=<rails path>`
- ```bash
  RAILS_ENV=production \
      SECRET_KEY_BASE=<some secret> \
      RAILS_SERVE_STATIC_FILES=1 \
      rails s
  ```

### Designs

https://app.zeplin.io/project/5ad8bfb98c928b070d6e1589

![Screen Shot 2019-06-11 at 4 53 05 PM](https://user-images.githubusercontent.com/30034042/59306010-670ef900-8c69-11e9-9d7e-0257dc363dac.png)

### GraphqQL fetch caching

We have switched our client's default fetchPolicy to network-only, preferring to have a loading state prior to fetching the most up to date data.

### ActiveAdmin User Interface

Use the admin interface to navigate models and edit their parameters. Can be used to alter the displayed wifi and bathroom codes, rearrange and adjust widget screen time, or even delete a traffic cam from view.
- Accessible through http://localhost:3000/admin
- user email: admin@example.com
- password: password

