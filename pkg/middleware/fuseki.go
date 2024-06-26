package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/api"
)

func FusekiMiddleware() gin.HandlerFunc {
	fusekiApi := api.NewFusekiAPI()

	return func(ctx *gin.Context) {
		ctx.Set("fuseki-api", fusekiApi)
		ctx.Next()
	}
}
