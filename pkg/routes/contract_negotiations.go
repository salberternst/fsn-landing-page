package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/api"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

func CreateContractNegotiation(ctx *gin.Context) {
	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	contractNegotiation := api.ContractRequest{}
	if err := ctx.BindJSON(&contractNegotiation); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": fmt.Sprintf("unable to bind contract definition: %v", err),
		})
		return
	}

	if contractNegotiation.PrivateProperties == nil {
		contractNegotiation.PrivateProperties = map[string]string{}
	}
	contractNegotiation.PrivateProperties["createdBy"] = claims.Subject

	createdContractDefinition, err := edcApi.CreateContractNegotiation(contractNegotiation)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_create_contract_definition",
			"message": fmt.Sprintf("unable to create contract definition: %v", err),
		})
		return
	}

	ctx.JSON(http.StatusCreated, createdContractDefinition)
}

func GetContractNegotiation(ctx *gin.Context) {
	id := ctx.Param("id")
	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	contractNegotiation, err := edcApi.GetContractNegotiation(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_contract_definition",
			"message": fmt.Sprintf("unable to get contract definition: %v", err),
		})
		return
	}

	ctx.JSON(http.StatusOK, contractNegotiation)
}

func addContractNegotationsRoutes(r *gin.RouterGroup) {
	contractNegotiations := r.Group("/api/portal/contractnegotiations")
	contractNegotiations.POST("/", CreateContractNegotiation)
	contractNegotiations.GET("/:id", GetContractNegotiation)
}
