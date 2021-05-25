# README

This project is a Rails 5.2 app using webpacker and React.

### Ruby version

MRI 2.5.7

### Installation options

You can either install the deps directly on your box or you can use the Docker support.

## Native

### Getting ready

Prequisites:
- libpq
  - Ubuntu: sudo apt install libpq-dev
  - OSX: sudo brew install libpq
- libsqlite3
  - Ubuntu: sudo apt install sqlite3 libsqlite3-dev
  - OSX: sudo brew install sqlite3
- asdf
  - OSX/Ubuntu: https://asdf-vm.com/#/core-manage-asdf?id=add-to-your-shell

- `asdf install`
- `gem install bundler:1.17.3`
- `gem install pg -v '1.1.3' --source 'https://rubygems.org/'`
- `gem install sqlite3 -v '1.3.13' --source 'https://rubygems.org/'`
- `gem install foreman`
- `bundle install`
- `yarn install`
- `cp .env.local.sample .env` -- fill in env vars where applicable
- Configure Redis:

  ```shell
  brew install redis
  redis-cli CONFIG SET dir /tmp/
  redis-cli CONFIG SET dbfilename temp.rdb
  redis-server &
  redis-cli ping  # Should respond with PONG
  rake db:setup
  ```

### Start it up

- `foreman start -f Procfile.development`
- http://localhost:5000

## Docker

### Getting Ready

- Install Docker and docker-compose
- `cp .env.local.sample .env` -- fill in env vars where applicable
- Sign up for a free [OpenWeather API key](https://home.openweathermap.org/api_keys)
 
  Note: the free API key has a daily limit of 1000 requests

### Start it up

- `docker-compose build`
- `docker-compose up`
- http://localhost:5000

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
