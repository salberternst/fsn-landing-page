package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/salberternst/fsn_landing_page/pkg/api"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

type Asset struct {
	ID         any    `json:"@id"`
	Type       string `json:"@type"`
	Properties struct {
		Name        string `json:"name"`
		ContentType string `json:"contenttype"`
	} `json:"properties"`
	DataAddress map[string]string `json:"dataAddress"`
}

type AssetQuery struct {
	Page     uint `form:"page" binding:"required"`
	PageSize uint `form:"page_size"  binding:"required"`
}

func getAssets(ctx *gin.Context) {
	assetQuery := AssetQuery{}
	if err := ctx.BindQuery(&assetQuery); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": fmt.Sprintf("unable to bind asset query: %v", err),
		})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)

	querySpec := api.QuerySpec{
		Context: map[string]string{
			"@vocab": "https://w3id.org/edc/v0.0.1/ns/",
		},
		Type:   "QuerySpec",
		Offset: (assetQuery.Page - 1) * assetQuery.PageSize,
		Limit:  assetQuery.PageSize,
		// SortOrder: "DESC",
		// SortField: "id",
		FilterExpression: []api.Criterion{
			{
				OperandLeft:  "privateProperties.'https://w3id.org/edc/v0.0.1/ns/createdBy'",
				Operator:     "=",
				OperandRight: claims.Subject,
			},
		},
	}

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	assets, err := edcApi.GetAssets(querySpec)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_assets",
			"message": fmt.Sprintf("unable to get assets: %v", err),
		})
		return
	}

	ctx.JSON(http.StatusOK, assets)
}

func getAsset(ctx *gin.Context) {
	id := ctx.Param("id")

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	asset, err := edcApi.GetAsset(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_asset",
			"message": fmt.Sprintf("unable to get asset: %v", err),
		})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)

	if asset.PrivateProperties == nil || asset.PrivateProperties["createdBy"] != claims.Subject {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "You are not allowed to access this asset"})
		return
	}

	ctx.JSON(http.StatusOK, asset)
}

func deleteAsset(ctx *gin.Context) {
	id := ctx.Param("id")

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)
	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)

	asset, err := edcApi.GetAsset(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_asset",
			"message": fmt.Sprintf("unable to get asset: %v", err),
		})
		return
	}

	if asset.PrivateProperties == nil || asset.PrivateProperties["createdBy"] != claims.Subject {
		ctx.JSON(http.StatusForbidden, gin.H{
			"status":  http.StatusForbidden,
			"error":   "forbidden",
			"message": "You are not allowed to delete this asset",
		})
		return
	}

	err = edcApi.DeleteAsset(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_delete_asset",
			"message": fmt.Sprintf("unable to delete asset: %v", err),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"id": id,
	})
}

func createAsset(ctx *gin.Context) {
	var asset api.Asset
	if err := ctx.BindJSON(&asset); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": fmt.Sprintf("unable to bind asset: %v", err),
		})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	asset.Id = uuid.New().String()
	if asset.PrivateProperties == nil {
		asset.PrivateProperties = map[string]string{}
	}
	asset.PrivateProperties["createdBy"] = claims.Subject

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)
	createdAsset, err := edcApi.CreateAsset(asset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_create_asset",
			"message": fmt.Sprintf("unable to create asset: %v", err),
		})
		return
	}

	ctx.JSON(http.StatusOK, createdAsset)
}

func addAssetsRoutes(r *gin.RouterGroup) {
	userGroup := r.Group("/api/portal/assets")
	userGroup.GET("/", getAssets)
	userGroup.GET("/:id", getAsset)
	userGroup.DELETE("/:id", deleteAsset)
	userGroup.POST("/", createAsset)
}
