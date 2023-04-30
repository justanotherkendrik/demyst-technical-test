package shared_utils

func DeterminePreassessmentValue(isBusinessProfitable, doesLoanExceedAssets bool) int {
	preAssessment := 20
	if isBusinessProfitable {
		preAssessment = 60
	}
	if !doesLoanExceedAssets {
		preAssessment = 100
	}

	return preAssessment
}
