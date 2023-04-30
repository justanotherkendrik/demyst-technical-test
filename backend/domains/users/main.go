package users

import (
	"backend/demyst-technical-interview/domains/users/routes"

	"github.com/gin-gonic/gin"
)

func InitializeRouterGroup(router *gin.Engine) {
	group := router.Group("/users")
	{
		group.GET("", routes.RetrieveUserDetails)
	}
}
