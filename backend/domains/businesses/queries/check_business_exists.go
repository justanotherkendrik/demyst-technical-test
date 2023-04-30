package business_queries

import (
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"context"
)

func CheckBusinessExistence(id int) error {
	db := database_service.RetrieveDatabase()
	query := "SELECT id FROM businesses WHERE id = $1"

	var businessId int
	err := db.QueryRow(context.Background(), query, id).Scan(&businessId)
	if err != nil {
		return err
	}

	return nil
}
