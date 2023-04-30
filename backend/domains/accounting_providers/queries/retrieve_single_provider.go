package accounting_provider_queries

import (
	"backend/demyst-technical-interview/domains/accounting_providers/schemas"

	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"context"
)

func RetrieveAccountingProviderDetails(id int) (*schemas.AccountingProvider, error) {
	db := database_service.RetrieveDatabase()
	query := "SELECT * FROM accounting_providers WHERE id = $1"

	var accountingProvider schemas.AccountingProvider
	err := db.QueryRow(context.Background(), query, id).Scan(&accountingProvider.ID, &accountingProvider.Name)
	if err != nil {
		return nil, err
	}

	return &accountingProvider, nil
}
