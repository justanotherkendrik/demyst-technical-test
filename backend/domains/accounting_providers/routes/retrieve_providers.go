package routes

import (
	providers_queries "backend/demyst-technical-interview/domains/accounting_providers/queries"
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func RetrieveProviders(ctx *gin.Context) {
	providersDetails, err := providers_queries.RetrieveProviders()
	response := gin.H{"providers": []interface{}{}}
	if err != nil {
		if err == pgx.ErrNoRows {
			ctx.IndentedJSON(http.StatusOK, response)
		} else if err != nil {
			logger_service.LogNonFatalError(err.Error())
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unexpected error occurred."})
		}
		return
	}

	response["providers"] = providersDetails
	ctx.IndentedJSON(http.StatusOK, response)
}
