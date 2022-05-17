# Integrations

As part of this application there are many integrations via widgets that are used.

## OpenWeather

OpenWeather is the current weather API that we use when displaying weather data on the helios homepage.

A key can be aquired here https://home.openweathermap.org/api_keys

Once an account is created the API key can be supplied to the corresponding environment variable

`WEATHER_API_KEY=<your_dev_key>`

## Slack

A Slack App and Bot are necessary to handle different events in Helios.

### Events

1. [Create a new Slack app](https://api.slack.com/apps) **from scratch** and pick the workspace you want it integrated into.
   ![](https://i.gyazo.com/f5e006fae710a2fa0ea7385bbaf72b98.png)
2. Go to "Event Subscriptions", "Enable Events", paste in the "Request URL" (Helios backend URL w/ web_hooks/slack), and wait until it verifies. After this, in "Subscribe to bot events" add the event `message.channels`.
   ![](https://i.gyazo.com/3a5cf9a32ea4f1c836ff8201de300ebb.png)
   ![](https://i.gyazo.com/e530872d2f0136724f4978ee49082e7e.png)
3. Go to "OAuth & Permissions" and click on "Install to Workplace" to generate an OAuth Token.
   ![](https://i.gyazo.com/478b3b2a86f0210000610e74bafe3907.png)
4. In Slack click on the channel name at the top where you want to add the bot, go to "Integrations" and then add the app that you just created.
   ![](https://i.gyazo.com/dab35ad22c7c5cc671164482f955c3a3.png)
   ![](https://i.gyazo.com/f32e9a1e7345c654f0d407a6c599c1e0.png)
5. Helios will now listen to any messages that appear in the channels that the bot is added to.

### Announcements

1. **First** follow the instructions in the "Events" section above.
2. Add the bot to the channels you want it to listen to messages in. This doesn't necessarily have to be the #helios channel, but it makes sense to communicate with the bot in the same channel you'll receive replies in.
3. Enable "Incoming Webhooks" in your Slack app settings, generate a webhook url for the #helios channel, and then update `SLACK_WEBHOOK_URL` in your .env. This is the channel where you will see the bot's replies whether your announcement was saved or if there was an error in the command you entered.

## Sending an Announcement

### Add an announcement using this format:

`@Helios guests: <message> to <people> from <company> on <publish date and time> in <office location>`

- ### The `<office location>` should be either `Providence` or `Boulder`
- ### The `<publish date and time>` should look like this:
  ✅ August 23rd 2019 at 09:00 am
  - ### Not like this (needs the suffix after the day)
    ❌ August 23 2019 at 09:00 am
  - ### Or this (needs the leading zero if hour is a single digit)
    ❌ August 23rd 2019 at 9:00 am

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
