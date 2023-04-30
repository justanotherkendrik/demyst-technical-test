package routes

import (
	user_queries "backend/demyst-technical-interview/domains/users/queries"
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func RetrieveUserDetails(ctx *gin.Context) {
	email := ctx.Query("email")
	if email == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User identity was not provided."})
		return
	}

	user, err := user_queries.RetrieveUserDetailsByEmail(email)

	if err != nil {
		logger_service.LogNonFatalError(err.Error())
		if err == pgx.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User could not be found."})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	ctx.IndentedJSON(http.StatusOK, *user)
}
