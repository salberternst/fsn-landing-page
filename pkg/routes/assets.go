package routes

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Asset struct {
	ID         any    `json:"@id"`
	Type       string `json:"@type"`
	Properties struct {
		Name        string `json:"name"`
		ContentType string `json:"contenttype"`
	} `json:"properties"`
	DataAddress struct {
		Type      string `json:"type"`
		Name      string `json:"name"`
		BaseURL   string `json:"baseUrl"`
		ProxyPath bool   `json:"proxyPath"`
	} `json:"dataAddress"`
}

type AssetQuery struct {
	Page     uint `form:"page" json:"user" binding:"required"`
	PageSize uint `form:"page_size" json:"password" binding:"required"`
}

type Criterion struct {
	Type         string      `json:"@type"`
	OperandLeft  interface{} `json:"operandLeft"`
	OperandRight interface{} `json:"operandRight"`
	Operator     string      `json:"operator"`
}

type QuerySpec struct {
	Context          map[string]string `json:"@context"`
	Type             string            `json:"@type"`
	Offset           uint              `json:"offset"`
	Limit            uint              `json:"limit"`
	SortOrder        string            `json:"sortOrder,omitempty"`
	SortField        string            `json:"sortField,omitempty"`
	FilterExpression []Criterion       `json:"filterExpression"`
}

func getAssets(ctx *gin.Context) {
	assetQuery := AssetQuery{}
	if err := ctx.BindQuery(&assetQuery); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	querySpec := QuerySpec{
		Context: map[string]string{
			"@vocab": "https://w3id.org/edc/v0.0.1/ns/",
		},
		Type:             "QuerySpec",
		Offset:           (assetQuery.Page - 1) * assetQuery.PageSize,
		Limit:            assetQuery.PageSize,
		FilterExpression: []Criterion{},
	}

	buffer, err := json.Marshal(querySpec)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	resp, err := http.Post("http://edc-provider:19193/management/v3/assets/request", "application/json", bytes.NewBuffer(buffer))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		ctx.JSON(resp.StatusCode, gin.H{"error": "Failed to fetch assets"})
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

func getAsset(ctx *gin.Context) {
	id := ctx.Param("id")

	resp, err := http.Get("http://edc-provider:19193/management/v3/assets/" + id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		ctx.JSON(resp.StatusCode, gin.H{"error": "Failed to fetch asset"})
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

func deleteAsset(ctx *gin.Context) {
	id := ctx.Param("id")

	req, err := http.NewRequest(http.MethodDelete, "http://edc-provider:19193/management/v3/assets/"+id, nil)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		ctx.JSON(resp.StatusCode, gin.H{"error": "Failed to delete asset"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Asset deleted"})
}

func createAsset(ctx *gin.Context) {
	var asset map[string]interface{}
	if err := ctx.BindJSON(&asset); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	buffer, err := json.Marshal(asset)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	print(string(buffer))

	resp, err := http.Post("http://edc-provider:19193/management/v3/assets", "application/json", bytes.NewBuffer(buffer))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		ctx.JSON(resp.StatusCode, gin.H{"error": "Failed to create asset"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Asset created"})
}

func addAssetsRoutes(r *gin.RouterGroup) {
	userGroup := r.Group("/api/assets")
	userGroup.GET("/", getAssets)
	userGroup.GET("/:id", getAsset)
	userGroup.DELETE("/:id", deleteAsset)
	userGroup.POST("/", createAsset)
}
