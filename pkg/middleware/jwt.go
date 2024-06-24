package middleware

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

type Claims struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func TokenMiddleware() gin.HandlerFunc {
	parser := jwt.NewParser()

	return func(ctx *gin.Context) {
		println("TokenMiddleware")
		println(ctx.GetHeader("X-Access-Token"))
		idToken := ctx.GetHeader("X-Access-Token")
		token, _, err := parser.ParseUnverified(idToken, &Claims{})
		if err == nil {
			if claims, ok := token.Claims.(*Claims); ok {
				ctx.Set("access-token-claims", claims)
				ctx.Next()
				return
			}
		}
		ctx.AbortWithError(http.StatusInternalServerError, errors.New("Unable to decode X-Access-Token"))
	}
}
