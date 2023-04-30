package shared_utils

import "backend/demyst-technical-interview/domains/businesses/subdomains/balances/schemas"

/*
Not sure if I understood this correctly, but I interpreted
"If a business has made a profit in the last 12 months" as the following:

Sum up all profitOrLoss, return true if positive and false otherwise.
*/
func IsBusinessProfitable(balanceSheet [](schemas.Balance)) (float64, bool) {
	var overallProfit float64 = 0
	for _, balance := range balanceSheet {
		overallProfit = overallProfit + balance.ProfitOrLoss
	}

	return overallProfit, overallProfit > 0
}
