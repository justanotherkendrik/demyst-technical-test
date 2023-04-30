#!/bin/bash

migrate -path ./migrations -database "postgresql://$1:$2@$3/$4?sslmode=disable" up