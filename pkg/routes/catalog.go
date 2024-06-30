package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/api"
)

func GetCatalog(ctx *gin.Context) {
	// claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	catalogRequest := api.CatalogRequest{}
	if err := ctx.BindJSON(&catalogRequest); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": fmt.Sprintf("unable to bind catalog request: %v", err),
		})
		return
	}

	catalog, err := edcApi.GetCatalog(catalogRequest)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, catalog)
}

func GetCatalogDataset(ctx *gin.Context) {
	// claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	var datasetRequest api.DatasetRequest
	if err := ctx.BindJSON(&datasetRequest); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": fmt.Sprintf("unable to bind dataset request: %v", err),
		})
		return
	}

	catalogDataset, err := edcApi.GetCatalogDataset(datasetRequest)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, catalogDataset)
}

func addCatalogsRoutes(r *gin.RouterGroup) {
	contractAgreements := r.Group("/api/catalog")
	contractAgreements.POST("/", GetCatalog)
	contractAgreements.POST("/dataset", GetCatalogDataset)
}
