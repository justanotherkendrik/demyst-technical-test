package tests_service

import (
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"strings"

	"context"
	"fmt"
	"os"
	"testing"

	"github.com/joho/godotenv"
)

func setup(envFileDir string) {
	var stringBuilder strings.Builder
	stringBuilder.WriteString(envFileDir)
	stringBuilder.WriteString("test.env")

	err := godotenv.Load(stringBuilder.String())
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	database_service.InitialiseDatabase()
}

func teardown() {
	db := database_service.RetrieveDatabase()
	if db != nil {
		defer db.Close(context.Background())
	}
}

func RunTestSuite(envFileDir string, m *testing.M) int {
	setup(envFileDir)
	code := m.Run()
	teardown()

	return code
}
