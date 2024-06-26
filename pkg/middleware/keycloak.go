package middleware

import (
	"net/http"

	"github.com/Clarilab/gocloaksession"
	"github.com/gin-gonic/gin"
)

func KeycloakMiddleware() gin.HandlerFunc {
	session, err := gocloaksession.NewSession("landing-page", "DRtT8aWx0hTcoxDxhY5OdsQkzlwcCPX7", "dataspace", "http://keycloak:8080")
	if err != nil {
		panic("Something wrong with the credentials or url")
	}

	return func(ctx *gin.Context) {
		client := session.GetGoCloakInstance()

		token, err := session.GetKeycloakAuthToken()
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "unauthorized",
				"status":  http.StatusUnauthorized,
			})
			ctx.Abort()
			return
		}

		ctx.Set("keycloak-client", client)
		ctx.Set("keycloak-token", token.AccessToken)

		ctx.Next()
	}
}
