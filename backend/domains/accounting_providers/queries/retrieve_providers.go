package accounting_provider_queries

import (
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"

	"backend/demyst-technical-interview/domains/accounting_providers/schemas"

	"context"
)

func RetrieveProviders() ([]schemas.AccountingProvider, error) {
	db := database_service.RetrieveDatabase()
	query := "SELECT * FROM accounting_providers"

	providerRows, err := db.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer providerRows.Close()

	var providers [](schemas.AccountingProvider)
	for providerRows.Next() {
		var provider schemas.AccountingProvider
		if err := providerRows.Scan(&provider.ID, &provider.Name); err != nil {
			return providers, err
		}

		providers = append(providers, provider)
	}

	if err = providerRows.Err(); err != nil {
		return providers, err
	}

	return providers, nil
}
