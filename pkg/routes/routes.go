package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

func AddRoutes(r *gin.Engine) {
	api := r.Group("/")

	addHealthRoutes(api)

	// only use the middlewares in the api group
	api.Use(middleware.TokenMiddleware())
	api.Use(middleware.KeycloakMiddleware())

	addUserRoutes(api)
	addAssetsRoutes(api)
	addCustomersRoutes(api)
}
