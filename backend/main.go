package main

import (
	cache_service "backend/demyst-technical-interview/shared/infrastructure/cache"
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"
	"fmt"
	"os"

	"backend/demyst-technical-interview/domains/accounting_providers"
	"backend/demyst-technical-interview/domains/businesses"
	"backend/demyst-technical-interview/domains/loans"
	"backend/demyst-technical-interview/domains/users"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func loadEnvironmentVariables() {
	appEnv, isAppEnvSet := os.LookupEnv("APP_ENV")
	if !isAppEnvSet {
		logger_service.LogWarning("Unable to determine APP_ENV, defaulting to development")
		appEnv = "development"
	}
	if appEnv != "container" {
		envFile := appEnv + ".env"
		err := godotenv.Load(envFile)
		if err != nil {
			logger_service.LogFatalError(fmt.Sprintf("Error loading environment variables, %s", err.Error()))
		}
	}
}

func main() {
	logger_service.InitializeLogger()

	loadEnvironmentVariables()

	database_service.InitialiseDatabase()
	cache_service.InitializeClient()

	router := gin.Default()
	router.Use(cors.Default())

	accounting_providers.InitializeRouterGroup(router)
	businesses.InitializeRouterGroup(router)
	loans.InitializeRouterGroup(router)
	users.InitializeRouterGroup(router)

	router.Run(os.Getenv("APP_URL"))
}
