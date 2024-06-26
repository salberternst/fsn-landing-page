package middleware

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

type Claims struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	TenantId string `json:"tenant_id"`
	jwt.RegisteredClaims
}

func TokenMiddleware() gin.HandlerFunc {
	parser := jwt.NewParser()

	return func(ctx *gin.Context) {
		idToken := ctx.GetHeader("X-Access-Token")
		token, _, err := parser.ParseUnverified(idToken, &Claims{})
		if err == nil {
			if claims, ok := token.Claims.(*Claims); ok {
				ctx.Set("access-token-claims", claims)
				ctx.Set("access-token", idToken)
				ctx.Next()
				return
			}
		}

		ctx.AbortWithError(http.StatusInternalServerError, errors.New("unable to decode X-Access-Token"))
	}
}
