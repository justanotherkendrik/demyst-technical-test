package decision_engine_service

/*
Exact behavior of the decision engine was not exactly stated, so I will assume the following behaviour first:

If the loan exceeds assets, the decision engine always returns false --> I would assume this is how financial crises are avoided.
Otherwise, return the a float value of the preAssessment --> 20 becomes 0.2, 100 becomes 1, so on and on.
*/

func SubmitLoanRequest(dto *SubmitLoanRequestDto) *SubmitLoanResultDto {
	var result SubmitLoanResultDto
	factor := float64(dto.preAssessmentValue) / 100.0
	result.Result(true).FinalAssessmentValue(factor).LoanAmount(dto.loanAmount * factor)

	return &result
}
