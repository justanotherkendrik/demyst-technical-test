package validators

import (
	shared_interfaces "backend/demyst-technical-interview/shared/infrastructure/interfaces"
	
	logger_service "backend/demyst-technical-interview/shared/infrastructure/logger"

	"fmt"

	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type existenceQuery[E shared_interfaces.Entities, EI shared_interfaces.EntityInterface[E]] func(int) (EI, error)

func ValidateEntityExistence[E shared_interfaces.Entities, EI shared_interfaces.EntityInterface[E]](query existenceQuery[E, EI], entityId int, entityType string, ctx *gin.Context) E {
	resultEntity, err := query(entityId)
	if err != nil {
		logger_service.LogNonFatalError(err.Error())
		if err == pgx.ErrNoRows {
			ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("%s not found.", entityType)})
		} else if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Unexpected error occurred."})
		}

		return nil
	}
	return resultEntity.Retrieve()
}
