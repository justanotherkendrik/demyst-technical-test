package routes

import (
	accounting_provider_queries "backend/demyst-technical-interview/domains/accounting_providers/queries"
	business_queries "backend/demyst-technical-interview/domains/businesses/queries"
	business_schemas "backend/demyst-technical-interview/domains/businesses/schemas"
	user_queries "backend/demyst-technical-interview/domains/users/queries"

	provider_schemas "backend/demyst-technical-interview/domains/accounting_providers/schemas"
	balance_schemas "backend/demyst-technical-interview/domains/businesses/subdomains/balances/schemas"
	loan_schemas "backend/demyst-technical-interview/domains/loans/schemas"
	user_schemas "backend/demyst-technical-interview/domains/users/schemas"

	loan_validators "backend/demyst-technical-interview/domains/loans/validators"

	cache_service "backend/demyst-technical-interview/shared/infrastructure/cache"
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"
	accounting_service "backend/demyst-technical-interview/shared/services/accounting"
	decision_engine_service "backend/demyst-technical-interview/shared/services/decision_engine"

	shared_utils "backend/demyst-technical-interview/shared/utils"

	"fmt"
	"log"

	"strconv"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateLoan(ctx *gin.Context) {
	loanInput := loan_schemas.CreateLoanSchema{}
	if err := ctx.BindJSON(&loanInput); err != nil {
		ctx.JSON(http.StatusBadRequest, err.Error())
		return
	}

	business := loan_validators.ValidateEntityExistence[*business_schemas.Business](business_queries.RetrieveBusinessDetailsById, loanInput.Business, "business", ctx)
	if business == nil {
		return
	}
	provider := loan_validators.ValidateEntityExistence[*provider_schemas.AccountingProvider](accounting_provider_queries.RetrieveAccountingProviderDetails, loanInput.AccountingProvider, "provider", ctx)
	if provider == nil {
		return
	}
	user := loan_validators.ValidateEntityExistence[*user_schemas.User](user_queries.RetrieveUserDetailsById, loanInput.Applicant, "user", ctx)
	if user == nil {
		return
	}

	var overallProfits float64
	var isBusinessProfitable bool
	var doesLoanExceedAssets bool

	balanceSummary := &balance_schemas.BalanceSummary{}
	err := cache_service.RetrieveFromHashMap(strconv.Itoa(business.ID), balanceSummary)
	if err != nil {
		log.Printf("Error retrieving business balance summary: %s", err.Error())
		timestamp := fmt.Sprint(time.Now())
		retrieveBalanceSheetPayload := (&accounting_service.RetrieveBalanceSheetDto{}).Timestamp(timestamp).Business(loanInput.Business)
		balanceSheet, err := accounting_service.RetrieveBalanceSheet(retrieveBalanceSheetPayload)
		if err != nil {
			logger_service.LogNonFatalError(err.Error())
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		overallProfits, isBusinessProfitable = shared_utils.IsBusinessProfitable(balanceSheet)
		doesLoanExceedAssets = shared_utils.DoesLoanExceedAssets(balanceSheet, loanInput.Amount)
	} else {
		doesLoanExceedAssets = loanInput.Amount >= balanceSummary.AverageAssetValue
		overallProfits = balanceSummary.OverallProfit
		isBusinessProfitable = balanceSummary.Profitable
	}

	preAssessment := shared_utils.DeterminePreassessmentValue(isBusinessProfitable, doesLoanExceedAssets)
	loanRequestPayload := (&decision_engine_service.SubmitLoanRequestDto{}).LoanAmount(loanInput.Amount).PreAssessmentValue(preAssessment).ProfitOrLossSummary(overallProfits).BusinessName(business.Name).YearEstablished(business.YearEstablished)
	loanResult := decision_engine_service.SubmitLoanRequest(loanRequestPayload)

	ctx.IndentedJSON(http.StatusCreated, *loanResult)
}
