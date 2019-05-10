RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get update -qq && apt-get install -yq build-essential nodejs unzip
RUN gem install foreman
FROM ruby:2.5.5
# upgrade bundler to avoid https://github.com/bundler/bundler/issues/4576
RUN gem install bundler -v 1.16
RUN npm install -g yarn
RUN useradd -ms /bin/bash -d /app app
RUN mkdir /app/secure && chown app:app /app/secure
RUN mkdir /app/tmp && chown app:app /app/tmp
WORKDIR /app
USER app
RUN bundle config git.allow_insecure true
COPY --chown=app vendor /app/vendor
COPY --chown=app Gemfile /app/Gemfile
COPY --chown=app Gemfile.lock /app/Gemfile.lock
RUN bundle install --jobs=4 --path vendor/bundle
RUN yarn install
COPY --chown=app . /app
