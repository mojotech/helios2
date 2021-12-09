FROM ruby:2.6.9

ARG USER_ID=1000
ARG GROUP_ID=1000

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash &&\
    apt-get update -qq && apt-get install -yq build-essential nodejs unzip &&\
    gem install bundler -v 1.16 &&\
    npm install -g yarn

# Create developer user and its group, prepare project directories.
RUN groupadd -g ${GROUP_ID} developers &&\
    useradd -l -u ${USER_ID} -g ${GROUP_ID} developer &&\
    install -d -m 0755 -o developer -g developers /home/developer &&\
    mkdir -p /helios/secure /helios/tmp &&\
    chown -R developer:developers /helios

WORKDIR /helios

COPY Gemfile /helios/Gemfile
COPY Gemfile.lock /helios/Gemfile.lock
RUN bundle install --jobs=4

USER developer

COPY package.json /helios/package.json
COPY yarn.lock /helios/yarn.lock
RUN yarn install

COPY --chown=developer:developers . /helios
