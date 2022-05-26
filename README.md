# README

The tech stack for this project consists of:
- Phoenix 1.6 Back end
- webpacker
- graphQL
- React Front end

To use the Phoenix back end set the environment variables as follows:
- BACKEND_URL=http://localhost:4000
- BACKEND_LANGUAGE=elixir

## Local development with Phoenix

[View the README] in the server-phoenix directory.

[View the README]: server-phoenix/README.me

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

### Integrations

There are a number of integrations used within the Helios app.
A more detailed desctipition of these integrations including how to
get started using them can be found [here](./INTEGRATIONS.md)

### Designs

https://app.zeplin.io/project/5ad8bfb98c928b070d6e1589

![Screen Shot 2019-06-11 at 4 53 05 PM](https://user-images.githubusercontent.com/30034042/59306010-670ef900-8c69-11e9-9d7e-0257dc363dac.png)

### GraphqQL fetch caching

We have switched our client's default fetchPolicy to network-only, preferring to have a loading state prior to fetching the most up to date data.
