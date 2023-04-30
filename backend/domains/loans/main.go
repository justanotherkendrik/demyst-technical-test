package loans

import (
	"backend/demyst-technical-interview/domains/loans/routes"

	"github.com/gin-gonic/gin"
)

func InitializeRouterGroup(router *gin.Engine) {
	group := router.Group("/loans")
	{
		group.POST("", routes.CreateLoan)
	}
}
