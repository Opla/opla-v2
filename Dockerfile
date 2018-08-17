FROM node:8.11

COPY ./package.json /src/

WORKDIR /src

ENV OPLA_BACKEND_DATABASE_HOST=db \
    OPLA_BACKEND_DATABASE_PORT=3306 \
    OPLA_BACKEND_DATABASE_NAME=opla \
    OPLA_BACKEND_DATABASE_USER=opla \
    OPLA_BACKEND_DATABASE_PASS=foo \
    SKIP_MIGRATION=false \
    MIGRATIONS_ONLY=false

RUN apt-get update && \
    apt-get install -y netcat \
    && rm -rf /var/lib/apt/lists/* \
    && yarn install

COPY ./ /src

VOLUME "/src/config"

RUN yarn compile && chmod u+x ./bin/opla ./bin/entrypoint.sh

ENTRYPOINT [ "./bin/entrypoint.sh" ]
