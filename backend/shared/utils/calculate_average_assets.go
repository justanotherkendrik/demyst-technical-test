package shared_utils

import "backend/demyst-technical-interview/domains/businesses/subdomains/balances/schemas"

func CalculateAverageAssets(balanceSheet [](schemas.Balance)) float64 {
	var averageAssetValue float64 = 0
	for _, balance := range balanceSheet {
		averageAssetValue = averageAssetValue + balance.AssetsValue
	}

	return averageAssetValue / float64(len(balanceSheet))
}
