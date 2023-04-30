package decision_engine_service

type SubmitLoanRequestDto struct {
	businessName        string
	yearEstablished     int
	loanAmount          float64
	profitOrLossSummary float64
	preAssessmentValue  int
}

func (schema *SubmitLoanRequestDto) BusinessName(businessName string) *SubmitLoanRequestDto {
	schema.businessName = businessName
	return schema
}

func (schema *SubmitLoanRequestDto) YearEstablished(yearEstablished int) *SubmitLoanRequestDto {
	schema.yearEstablished = yearEstablished
	return schema
}

func (schema *SubmitLoanRequestDto) LoanAmount(amount float64) *SubmitLoanRequestDto {
	schema.loanAmount = amount
	return schema
}

func (schema *SubmitLoanRequestDto) ProfitOrLossSummary(profitOrLossSummary float64) *SubmitLoanRequestDto {
	schema.profitOrLossSummary = profitOrLossSummary
	return schema
}

func (schema *SubmitLoanRequestDto) PreAssessmentValue(preAssessmentValue int) *SubmitLoanRequestDto {
	schema.preAssessmentValue = preAssessmentValue
	return schema
}

type SubmitLoanResultDto struct {
	FinalLoanAmount float64 `json:"loan_amount"`
	AssessmentValue float64 `json:"assessment_value"`
	LoanResult      bool    `json:"result"`
}

func (schema *SubmitLoanResultDto) LoanAmount(amount float64) *SubmitLoanResultDto {
	schema.FinalLoanAmount = amount
	return schema
}

func (schema *SubmitLoanResultDto) Result(result bool) *SubmitLoanResultDto {
	schema.LoanResult = result
	return schema
}

func (schema *SubmitLoanResultDto) FinalAssessmentValue(assessmentValue float64) *SubmitLoanResultDto {
	schema.AssessmentValue = assessmentValue
	return schema
}
