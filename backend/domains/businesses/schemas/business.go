package schemas

type Business struct {
	ID              int     `json:"id"`
	Name            string  `json:"name"`
	YearEstablished int     `json:"year_established"`
	AssetValue      float64 `json:"asset_value"`
}

func (schema *Business) Retrieve() *Business {
	return schema
}
