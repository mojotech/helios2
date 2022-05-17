# Helios

## Dependency Management With asdf

You may use [asdf] or a similar version manager to manage programming language dependencies. The [`bin/setup-phx`] script assumes the presence of asdf, and uses it to install Elixir, Phoenix, and Node.js onto your machine in an isolated fashion, so there is no need to install these particular tools yourself. Check for the existence of asdf with:

```sh
asdf --version
```

Please follow the [asdf installation instructions] for your platform, up to the "Core Installation Complete" section.

[asdf]: https://asdf-vm.com
[`bin/setup`]: /bin/setup
[asdf installation instructions]: https://asdf-vm.com/guide/getting-started.html

## Setup

Once asdf is installed execute the following from the root directory to set up helios:

```sh
chmod +x bin/setup-phx
./bin/setup-phx
```

This [script] will:

1. Create a `.tool-versions` file for use by asdf from the dependency versions specified in the Heroku buildpack configuration files
1. Install or update asdf plugins for Erlang, Elixir, and Node.js
1. Install Erlang, Elixir, Node.js, and npm
1. Copy environment variables from [`.envrc.sample`] to a .env file
1. Install server-side and client-side dependencies
1. Install and start up a Redis Server
1. Install and start up a dockerized postgres db running in detached mode

The [`bin/setup-phx`] script can be safely re-run. It should be run every time a dependency version is updated in [`elixir_buildpack.config`] or [`phoenix_static_buildpack.config`].

[`.envrc.sample`]: .envrc.sample
[script]: /bin/setup-phx
[`elixir_buildpack.config`]: elixir_buildpack.config
[`phoenix_static_buildpack.config`]: phoenix_static_buildpack.config

## Development

### getting ready

### PostgreSQL

This project uses [PostgreSQL] as its database. Install postgreSQL locally with the [postgresql wiki] or use to run your postgres database.
The setup script starts up Redis and a postgres docker container in the background (detached).
Start them manually with:

```sh
cd server-phoenix
docker-compose up -d
```

[postgresql]: https://www.postgresql.org
[postgresql wiki]: https://wiki.postgresql.org/wiki/Detailed_installation_guides

The setup script also seeds the database. To seed the database manually run:

```sh
cd server-phoenix
mix run priv/repo/seeds.exs
```

Start up the Phoenix server with:

```sh
mix phx.server
```

For a better debugging experience, run the server inside IEx (Interactive Elixir) with:

```sh
iex -S mix phx.server
```

Visit [`localhost:4000`](http://localhost:4000) in your browser.

You may create a `.iex.exs` file from the provided [`.iex.sample.exs`] in order to configure your local IEx sessions with common conveniences.

```sh
cp .iex.sample.exs .iex.exs
```

[`.iex.sample.exs`]: .iex.sample.exs

## Code Formatting

Please see the following links and your editor documentation to configure automatic formatting on file save.

- [Elixir Formatter]
- [Prettier] (CSS, JavaScript, JSON, Markdown, YAML, etc.)

[elixir formatter]: https://hexdocs.pm/mix/master/Mix.Tasks.Format.html
[prettier]: https://prettier.io/

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

- Official website: https://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Forum: https://elixirforum.com/c/phoenix-forum
- Source: https://github.com/phoenixframework/phoenix
