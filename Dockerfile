FROM ruby:2.5.1
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash &&\
    apt-get update -qq && apt-get install -yq build-essential nodejs unzip &&\
    gem install bundler -v 1.16 &&\
    npm install -g yarn

RUN useradd -ms /bin/bash -d /helios app
RUN mkdir /helios/secure && chown app:app /helios/secure
RUN mkdir /helios/tmp && chown app:app /helios/tmp
WORKDIR /helios

COPY Gemfile /helios/Gemfile
COPY Gemfile.lock /helios/Gemfile.lock
RUN bundle install --jobs=4

USER app
RUN bundle config git.allow_insecure true
RUN yarn install
COPY --chown=app . /helios
