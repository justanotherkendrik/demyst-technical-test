package accounting_providers

import (
	"backend/demyst-technical-interview/domains/accounting_providers/routes"

	"github.com/gin-gonic/gin"
)

func InitializeRouterGroup(router *gin.Engine) {
	providersGroup := router.Group("/accounting_providers")
	{
		providersGroup.GET("", routes.RetrieveProviders)
	}
}
