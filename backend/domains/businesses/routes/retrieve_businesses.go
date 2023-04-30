package routes

import (
	business_queries "backend/demyst-technical-interview/domains/businesses/queries"
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func RetrieveBusinesses(ctx *gin.Context) {
	businessDetails, err := business_queries.RetrieveBusinesses()
	response := gin.H{"businesses": []interface{}{}}

	if err != nil {
		fmt.Println(err)
		if err == pgx.ErrNoRows {
			ctx.IndentedJSON(http.StatusOK, response)
		} else if err != nil {
			logger_service.LogNonFatalError(err.Error())
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Unexpected error occurred."})
		}
		return
	}

	response = map[string]interface{}{"businesses": businessDetails}
	ctx.IndentedJSON(http.StatusOK, response)
}
