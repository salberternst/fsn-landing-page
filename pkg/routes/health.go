package routes

import (
	"github.com/gin-gonic/gin"
)

func getHealth(ctx *gin.Context) {
	ctx.String(200, "OK")
}

func addHealthRoutes(r *gin.RouterGroup) {
	r.GET("/health", getHealth)
}
