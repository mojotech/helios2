# Integrations

As part of this application there are many integrations via widgets that are used.

## OpenWeather

OpenWeather is the current weather API that we use when displaying weather data on the helios homepage.

A key can be aquired here https://home.openweathermap.org/api_keys

Once an account is created the API key can be supplied to the corresponding environment variable

`WEATHER_API_KEY=<your_dev_key>`

## Slack

A Slack App and Bot are necessary to handle different events in Helios.

### Authentication

All the keys can be found in the [app](https://api.slack.com/apps)'s _Basic Information_ section (if you are a collaborator) and supplied to the Slack environment variables:

- `SLACK_CLIENT_ID=<Client ID>`
- `SLACK_API_SECRET=<Client Secret>`
- `SLACK_VERIFICATION_TOKEN=<Verification Token>`

The _Event Subscriptions_ Request URL should be the URL to the `slack_controller`. It is verified if the controller responds with the `challenge` parameter when a JSON with type `url_verification` is sent.

The _OAuth & Permissions_ Redirect URL should be the URL to the `slack_auth_controller`. This is used to authenticate and install the App on the Slack Workspace. The `SLACK_REDIRECT_URI` environment variable should be the same as this.

### Message Count

The Slack Helios App should be subscribed to all `message` Workspace Events in the _Events Subscriptions_ section. The Bot should be subscribed to all `message` Bot Events in case the Bot was added to a private channel.

### Announcements

The Slack Helios Bot should be subscribed to the `app_mention` Bot Event.
For the bot to send messages back, the _Incoming Webhooks_ App should be installed from the [Slack App Directory](https://mojotech.slack.com/apps). The `Webhook URL` provided by this app should be supplied to the `SLACK_WEBHOOK_URL` environment variable.

## Twitter

Sign up for a Twitter developer account [here](https://developer.twitter.com/en/portal/petition/essential/basic-info). This will require a new or existing Twitter account.
This process should also walk you through the process of creating and acquiring API keys for your first app.

You will likely need to [apply for 'Elevated' API access](https://developer.twitter.com/en/portal/products/elevated). This is necessary for Twitter API v1 access, and might take some time for approval.
This will give you access to your "Access Tokens".

Once access is granted, all the keys needed for your environment variables can be found in your App's "Keys and Tokens" page on the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard), named as follows:
- `TWITTER_CONSUMER_KEY=<API Key>`
- `TWITTER_CONSUMER_SECRET=<API Secret>`
- `TWITTER_ACCESS_TOKEN=<Authentication Token>`
- `TWITTER_ACCESS_SECRET=<Authentication Secret>`

## Google

In order to set up the API keys for the Google authentication and integration with Elixir, simply follow the instructions found [here](https://github.com/dwyl/elixir-auth-google/blob/main/create-google-app-guide.md). The API keys are stored in `.env` as follows:
- `GOOGLE_CLIENT_ID=<Client ID>`
- `GOOGLE_CLIENT_SECRET=<Client Secret>`