FROM ruby:2.5.1

ARG USER_ID=1000
ARG GROUP_ID=1000

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash &&\
    apt-get update -qq && apt-get install -yq build-essential nodejs unzip &&\
    gem install bundler -v 1.16 &&\
    npm install -g yarn

RUN groupadd -g ${GROUP_ID} developers &&\
    useradd -l -u ${USER_ID} -g ${GROUP_ID} developer &&\
    install -d -m 0755 -o developer -g developers /home/developer

RUN mkdir /helios && chown developer:developers /helios
RUN mkdir /helios/secure && chown developer:developers /helios/secure
RUN mkdir /helios/tmp && chown developer:developers /helios/tmp

WORKDIR /helios

COPY Gemfile /helios/Gemfile
COPY Gemfile.lock /helios/Gemfile.lock
RUN bundle install --jobs=4

USER developer

RUN bundle config git.allow_insecure true
RUN yarn install
COPY --chown=developer:developers . /helios
