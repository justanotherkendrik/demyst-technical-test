package user_queries

import (
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"context"
)

func CheckUserExistence(id int) error {
	db := database_service.RetrieveDatabase()
	query := "SELECT id FROM users WHERE id = $1"

	var userId int
	err := db.QueryRow(context.Background(), query, id).Scan(&userId)
	if err != nil {
		return err
	}

	return nil
}
