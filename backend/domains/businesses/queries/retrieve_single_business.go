package business_queries

import (
	schema "backend/demyst-technical-interview/domains/businesses/schemas"
	"context"

	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
)

func RetrieveBusinessDetailsById(id int) (*schema.Business, error) {
	db := database_service.RetrieveDatabase()
	query := "SELECT * FROM businesses WHERE id = $1"

	var business schema.Business
	err := db.QueryRow(context.Background(), query, id).Scan(&business.ID, &business.Name, &business.YearEstablished, &business.AssetValue)

	if err != nil {
		return nil, err
	}
	return &business, nil
}
