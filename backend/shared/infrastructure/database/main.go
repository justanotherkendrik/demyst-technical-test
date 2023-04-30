package database_service

import (
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"

	"context"
	"os"

	"github.com/jackc/pgx/v5"
)

var db *pgx.Conn

func InitialiseDatabase() {
	var err error
	db, err = pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		logger_service.LogFatalError(err.Error())
	}
}

func RetrieveDatabase() *pgx.Conn {
	return db
}
