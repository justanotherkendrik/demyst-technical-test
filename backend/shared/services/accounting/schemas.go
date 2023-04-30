package accounting_service

type RetrieveBalanceSheetDto struct {
	timestamp string
	business  int
}

func (schema *RetrieveBalanceSheetDto) Timestamp(timestamp string) *RetrieveBalanceSheetDto {
	schema.timestamp = timestamp
	return schema
}

func (schema *RetrieveBalanceSheetDto) Business(business int) *RetrieveBalanceSheetDto {
	schema.business = business
	return schema
}
