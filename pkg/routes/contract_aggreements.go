package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/api"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

type ContractAgreementsQuery struct {
	Page     uint `form:"page" binding:"required"`
	PageSize uint `form:"page_size"  binding:"required"`
}

func GetContractAgreements(ctx *gin.Context) {
	query := ContractAgreementsQuery{}
	if err := ctx.BindQuery(&query); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	querySpec := api.QuerySpec{
		Context: map[string]string{
			"@vocab": "https://w3id.org/edc/v0.0.1/ns/",
		},
		Type: "QuerySpec",
		FilterExpression: []api.Criterion{
			{
				OperandLeft:  "privateProperties.'https://w3id.org/edc/v0.0.1/ns/createdBy'",
				Operator:     "=",
				OperandRight: claims.Subject,
			},
		},
	}

	assets, err := edcApi.GetAssets(querySpec)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_assets",
			"message": fmt.Sprintf("unable to get assets: %v", err),
		})
		return
	}

	if len(assets) == 0 {
		ctx.JSON(http.StatusOK, []api.ContractAgreement{})
		return
	}

	assetIds := []string{}
	for _, asset := range assets {
		assetIds = append(assetIds, asset.Id)
	}

	querySpec = api.QuerySpec{
		Context: map[string]string{
			"@vocab": "https://w3id.org/edc/v0.0.1/ns/",
		},
		Type: "QuerySpec",
		FilterExpression: []api.Criterion{
			{
				OperandLeft:  "assetId",
				Operator:     "in",
				OperandRight: assetIds,
			},
		},
	}

	contractAgreements, err := edcApi.GetContractAgreements(querySpec)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_contract_agreements",
			"message": fmt.Sprintf("unable to get contract agreements: %v", err),
		})
		return
	}

	ctx.JSON(http.StatusOK, contractAgreements)
}

func GetContractAgreement(ctx *gin.Context) {
	id := ctx.Param("id")

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	contractAgreement, err := edcApi.GetContractAgreement(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// todo: check if user is allowed to access this contract agreement
	// todo: admin can see all contract agreements

	ctx.JSON(http.StatusOK, contractAgreement)
}

func GetContractAgreementNegotiation(ctx *gin.Context) {
	id := ctx.Param("id")

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	contractAgreementNegotiation, err := edcApi.GetContractAgreementNegotiation(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, contractAgreementNegotiation)
}

func addContractAggreementsRoutes(r *gin.RouterGroup) {
	contractAgreements := r.Group("/api/portal/contractagreements")
	contractAgreements.GET("/", GetContractAgreements)
	contractAgreements.GET("/:id", GetContractAgreement)
	contractAgreements.GET("/:id/negotiation", GetContractAgreementNegotiation)
}
