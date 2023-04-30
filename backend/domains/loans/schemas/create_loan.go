package schemas

type CreateLoanSchema struct {
	Business           int     `json:"business" binding:"required"`
	AccountingProvider int     `json:"accounting_provider" binding:"required"`
	Applicant          int     `json:"applicant" binding:"required"`
	Amount             float64 `json:"amount" binding:"required,gt=0"`
}
