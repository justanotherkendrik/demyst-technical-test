#!/bin/bash

if [ $# -eq 0 ]; then
    docker compose -f docker-compose.backend.yml down
    docker compose -f docker-compose.frontend.yml down
else
    docker compose -f docker-compose.${1}.yml down
fi
