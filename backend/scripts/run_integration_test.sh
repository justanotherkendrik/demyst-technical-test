#!/bin/bash

docker-compose -f docker-compose.test.yml --env-file test.env up -d

docker ps

migrate -path ./migrations -database "postgresql://$1:$2@$3/$4?sslmode=disable" up

go test ./...

docker stop test_db

docker system prune -f