#!/bin/bash

APP_ENV=$1

if [ $# -eq 0 ]; then
    docker compose -f docker-compose.backend.yml down
    docker compose -f docker-compose.frontend.yml down
else
    docker compose -f docker-compose.${APP_ENV}.yml down
fi

if [[ $APP_ENV == "backend" || $# -eq 0 ]]; then
    docker image rm backend postgres redis
fi

if [[ $APP_ENV == "frontend" || $# -eq 0 ]]; then
    docker image rm frontend
fi
