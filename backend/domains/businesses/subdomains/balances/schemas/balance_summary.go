package schemas

type BalanceSummary struct {
	AverageAssetValue float64 `redis:"average_asset_value"`
	OverallProfit     float64 `redis:"overall_profit"`
	Profitable        bool    `redis:"is_profitable"`
}

func (schema *BalanceSummary) AssetValue(value float64) *BalanceSummary {
	schema.AverageAssetValue = value
	return schema
}

func (schema *BalanceSummary) Profit(value float64) *BalanceSummary {
	schema.OverallProfit = value
	return schema
}

func (schema *BalanceSummary) IsProfitable(flag bool) *BalanceSummary {
	schema.Profitable = flag
	return schema
}
