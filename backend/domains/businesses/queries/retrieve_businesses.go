package business_queries

import (
	"backend/demyst-technical-interview/domains/businesses/schemas"

	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"context"
)

func RetrieveBusinesses() ([]schemas.Business, error) {
	db := database_service.RetrieveDatabase()
	query := "SELECT * FROM businesses"

	businessRows, err := db.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer businessRows.Close()

	var businesses [](schemas.Business)
	for businessRows.Next() {
		var business schemas.Business
		if err := businessRows.Scan(&business.ID, &business.Name, &business.YearEstablished, &business.AssetValue); err != nil {
			return businesses, err
		}

		businesses = append(businesses, business)
	}

	if err = businessRows.Err(); err != nil {
		return businesses, err
	}

	return businesses, nil
}
