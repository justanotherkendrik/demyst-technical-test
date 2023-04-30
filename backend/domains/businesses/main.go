package businesses

import (
	routes "backend/demyst-technical-interview/domains/businesses/routes"
	balances_routes "backend/demyst-technical-interview/domains/businesses/subdomains/balances/routes"

	"github.com/gin-gonic/gin"
)

func InitializeRouterGroup(router *gin.Engine) {
	businessGroup := router.Group("/businesses")
	{
		businessGroup.GET("", routes.RetrieveBusinesses)

		balanceGroup := businessGroup.Group(":business")
		{
			balanceGroup.GET("balances", balances_routes.RetrieveBalanceSheet)
		}

	}
}
