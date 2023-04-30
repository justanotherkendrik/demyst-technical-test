package main

import (
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"
	tests_service "backend/demyst-technical-interview/shared/infrastructure/tests"

	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	code := tests_service.RunTestSuite("./", m)
	os.Exit(code)
}

func TestDatabaseInitialization(t *testing.T) {
	db := database_service.RetrieveDatabase()
	assert.NotEqual(t, db, nil)
}

func TestLoggerInitialization(t *testing.T) {
	// Avoid using the logger in test for now
	logger_service.LogWarning("hello world")
	logger_service.LogFatalError("hello world")
	logger_service.LogNonFatalError("hello world")
}
