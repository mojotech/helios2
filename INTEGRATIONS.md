# Integrations

As part of this application there are many integrations via widgets that are used.

## Dark Sky

Dark Sky is the current weather API that we use when displaying weather data on the helios homepage.

A key can be aquired here https://darksky.net/dev

Once an account is created the API key can be supplied to the corresponding environment variable

`DARK_SKY_API_KEY=<your_dev_key>`

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
