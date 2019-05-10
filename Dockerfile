FROM ruby:2.5.5
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash \
    && apt-get update -qq \
    && apt-get install -yq build-essential nodejs unzip \
    && gem install foreman \
    && npm install -g yarn

# upgrade bundler to avoid https://github.com/bundler/bundler/issues/4576
# RUN gem install bundler -v 1.17.1
# RUN useradd -ms /bin/bash -d /app app

RUN mkdir -p /app/secure \
    && mkdir -p /app/tmp 

COPY . /app
COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock
WORKDIR /app

RUN bundle config git.allow_insecure true \
    && bundle install --jobs=4 \
    && yarn install
