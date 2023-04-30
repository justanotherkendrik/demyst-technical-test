package accounting_service

import (
	"backend/demyst-technical-interview/domains/businesses/subdomains/balances/schemas"
	database_service "backend/demyst-technical-interview/shared/infrastructure/database"
	"context"
)

// This should actually be calling another service that's not in this codebase at all.
// For simplicity's sake (pretty sure I'm making it a little more complicated than intended),
// let's just use the same database_service.
func RetrieveBalanceSheet(dto *RetrieveBalanceSheetDto) ([](schemas.Balance), error) {
	db := database_service.RetrieveDatabase()

	query := "SELECT recorded_time::text, profit_or_loss, assets_value FROM balances WHERE business = $1 AND recorded_time > DATE_TRUNC('month', current_date) - INTERVAL '12 months' ORDER BY recorded_time DESC"
	balanceRows, err := db.Query(context.Background(), query, dto.business)
	if err != nil {
		return nil, err
	}
	defer balanceRows.Close()

	var balanceSheet [](schemas.Balance)
	for balanceRows.Next() {
		var balance (schemas.Balance)
		if err := balanceRows.Scan(&balance.Timestamp, &balance.ProfitOrLoss, &balance.AssetsValue); err != nil {
			return balanceSheet, err
		}

		balanceSheet = append(balanceSheet, balance)
	}

	if err = balanceRows.Err(); err != nil {
		return balanceSheet, err
	}

	return balanceSheet, nil
}
