package schemas

type Balance struct {
	ProfitOrLoss float64 `json:"profit_or_loss"`
	AssetsValue  float64 `json:"assets_value"`
	Timestamp    string  `json:"timestamp"`
}
