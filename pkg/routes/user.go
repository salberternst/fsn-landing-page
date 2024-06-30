package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

type UserInfo struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func getInfo(ctx *gin.Context) {
	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	ctx.JSON(http.StatusOK, UserInfo{
		Email: claims.Email,
		Name:  claims.Name,
	})
}

func addUserRoutes(r *gin.RouterGroup) {
	userGroup := r.Group("/api/portal/user")
	userGroup.GET("/info", getInfo)
}
