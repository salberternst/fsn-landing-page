package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/api"
)

func ThingsboardMiddleware() gin.HandlerFunc {
	thingsboardApi := api.NewThingsboardAPI()

	return func(ctx *gin.Context) {
		ctx.Set("thingsboard-api", thingsboardApi)
		ctx.Next()
	}
}
