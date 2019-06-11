# README

This project is a Rails 5.2 app using webpacker and React.

### Ruby version

MRI 2.5.1

### Installation options

You can either install the deps directly on your box or you can use the Docker support.

## Native

### Getting ready

- `bundle install`
- `yarn install`
- `cp .env.local.sample .env` -- fill in env vars where applicable
- Configure Redis:

  ```shell
  brew install redis
  redis-cli CONFIG SET dir/tmp/
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
- Sign up for a free darksky API key: https://darksky.net/dev
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

![screen shot 2018-06-13 at 7 49 27 am](https://user-images.githubusercontent.com/2212806/41349620-6dca83e4-6ede-11e8-9913-ccec4fad09d2.png)
