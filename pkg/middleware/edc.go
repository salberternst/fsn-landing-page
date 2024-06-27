package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/api"
)

func EdcMiddleware() gin.HandlerFunc {
	edcApi := api.NewEdcAPI()

	return func(ctx *gin.Context) {
		ctx.Set("edc-api", edcApi)
		ctx.Next()
	}
}
