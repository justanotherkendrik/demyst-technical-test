#!/bin/bash

if [ $# -eq 0 ]; then
    docker compose -f docker-compose.backend.yml --env-file backend.env up -d
    docker compose -f docker-compose.frontend.yml --env-file frontend.env up -d
else
    docker compose -f docker-compose.${1}.yml --env-file ${1}.env up -d
fi