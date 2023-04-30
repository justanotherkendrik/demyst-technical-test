package schemas

type AccountingProvider struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (schema *AccountingProvider) Retrieve() *AccountingProvider {
	return schema
}
