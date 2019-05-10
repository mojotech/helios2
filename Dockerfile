FROM ruby:2.5.1
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash &&\
    apt-get update -qq && apt-get install -yq build-essential nodejs unzip &&\
    gem install foreman &&\
    gem install bundler -v 1.16 &&\
    npm install -g yarn

RUN useradd -ms /bin/bash -d /app app
RUN mkdir /app/secure && chown app:app /app/secure
RUN mkdir /app/tmp && chown app:app /app/tmp
WORKDIR /app

COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
RUN bundle install --jobs=4

USER app
RUN bundle config git.allow_insecure true
RUN yarn install
COPY --chown=app . /app
