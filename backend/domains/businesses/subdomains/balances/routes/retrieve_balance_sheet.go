package routes

import (
	cache_service "backend/demyst-technical-interview/shared/infrastructure/cache"
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"
	accounting_service "backend/demyst-technical-interview/shared/services/accounting"

	business_queries "backend/demyst-technical-interview/domains/businesses/queries"

	balances_validators "backend/demyst-technical-interview/domains/businesses/subdomains/balances/validators"

	shared_utils "backend/demyst-technical-interview/shared/utils"

	"fmt"

	"strconv"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func RetrieveBalanceSheet(ctx *gin.Context) {
	inputBusiness := ctx.Param("business")
	isBusinessValid := balances_validators.ValidateBusinessInput(inputBusiness)
	if !isBusinessValid {
		logger_service.LogNonFatalError("Invalid business ID provided.")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid business ID provided."})
		return
	}

	business, _ := strconv.Atoi(inputBusiness)
	businessDetails, err := business_queries.RetrieveBusinessDetailsById(business)
	if err != nil {
		logger_service.LogNonFatalError(err.Error())
		if err == pgx.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Business could not be found."})
		} else if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	timestamp := fmt.Sprint(time.Now())
	retrieveBalanceSheetPayload := (&accounting_service.RetrieveBalanceSheetDto{}).Timestamp(timestamp).Business(businessDetails.ID)
	balanceSheet, err := accounting_service.RetrieveBalanceSheet(retrieveBalanceSheetPayload)
	if err != nil {
		logger_service.LogNonFatalError(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	overallProfit, isBusinessProfitable := shared_utils.IsBusinessProfitable(balanceSheet)
	averageAssetValue := shared_utils.CalculateAverageAssets(balanceSheet)
	cacheInputPayload := map[string]interface{}{"average_asset_value": averageAssetValue, "overall_profit": overallProfit, "is_profitable": isBusinessProfitable}
	err = cache_service.StoreToHashMap(strconv.Itoa(businessDetails.ID), cacheInputPayload)
	if err != nil {
		logger_service.LogNonFatalError(err.Error())
	}

	response := gin.H{"balance_sheet": balanceSheet, "business": businessDetails}
	ctx.IndentedJSON(http.StatusOK, response)
}
