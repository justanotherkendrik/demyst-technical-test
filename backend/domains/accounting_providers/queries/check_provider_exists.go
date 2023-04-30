package accounting_provider_queries

import (
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"context"
)

func CheckProviderExistence(id int) error {
	db := database_service.RetrieveDatabase()
	query := "SELECT id FROM accounting_providers WHERE id = $1"

	var providerId int
	err := db.QueryRow(context.Background(), query, id).Scan(&providerId)
	if err != nil {
		return err
	}

	return nil
}
