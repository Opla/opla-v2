ARG APP_VERSION=x.x.x
ARG APP_BUILD=xxx
ARG APP_SUBNAME=CE

FROM node:8.11

LABEL maintainer="support@opla.ai"

COPY ./package.json /src/

WORKDIR /src

ENV OPLA_FRONT_CLIENT_NAME=opla \
    OPLA_BACKEND_HOST=back.localhost \
    OPLA_API_DOMAIN=back.localhost \
    OPLA_BACKEND_PORT=8081 \
    OPLA_BACKEND_PROTOCOL=http \
    APP_SUBNAME=${APP_SUBNAME} \
    APP_VERSION=${APP_VERSION} \
    APP_BUILD=${APP_BUILD}

RUN yarn install

COPY ./ /src

VOLUME "/src/config"

RUN printf "{}\n" > config/default.json \
    && yarn build:prod \
    && chmod u+x ./bin/opla ./bin/entrypoint.sh

ENTRYPOINT [ "bin/entrypoint.sh" ]
