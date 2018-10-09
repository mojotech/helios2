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
- `docker-compose run web bundle exec rails console`
  - if it gives any errors, try the following command:
    - `docker-compose run web bundle exec rake app:update:bin`

### Designs

https://app.zeplin.io/project/5ad8bfb98c928b070d6e1589

![screen shot 2018-06-13 at 7 49 27 am](https://user-images.githubusercontent.com/2212806/41349620-6dca83e4-6ede-11e8-9913-ccec4fad09d2.png)
