package shared_utils

import "backend/demyst-technical-interview/domains/businesses/subdomains/balances/schemas"

func DoesLoanExceedAssets(balanceSheet [](schemas.Balance), loanValue float64) bool {
	averageAssetValue := CalculateAverageAssets(balanceSheet)
	return loanValue > (averageAssetValue / float64(len(balanceSheet)))
}
