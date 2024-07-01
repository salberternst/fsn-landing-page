package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/salberternst/fsn_landing_page/pkg/api"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

type PolicyQuery struct {
	Page      uint   `form:"page" json:"page" binding:"required"`
	PageSize  uint   `form:"page_size" json:"page_size" binding:"required"`
	SortOrder string `form:"sort_order" json:"sort_order"`
	SortField string `form:"sort_field" json:"sort_field"`
}

func getPolicies(ctx *gin.Context) {
	policyQuery := PolicyQuery{}
	if err := ctx.BindQuery(&policyQuery); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "invalid_query_parameters",
			"message": err.Error(),
		})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)

	querySpec := api.QuerySpec{
		Context: map[string]string{
			"@vocab": "https://w3id.org/edc/v0.0.1/ns/",
		},
		Type:   "QuerySpec",
		Offset: (policyQuery.Page - 1) * policyQuery.PageSize,
		Limit:  policyQuery.PageSize,
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
	policies, err := edcApi.GetPolicies(querySpec)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_policies",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, policies)
}

func getPolicy(ctx *gin.Context) {
	id := ctx.Param("id")

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)
	policyDefinition, err := edcApi.GetPolicy(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_policy",
			"message": err.Error(),
		})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	if policyDefinition.PrivateProperties == nil || policyDefinition.PrivateProperties["createdBy"] != claims.Subject {
		ctx.JSON(http.StatusForbidden, gin.H{
			"status":  http.StatusForbidden,
			"error":   "forbidden",
			"message": "You are not allowed to access this policy",
		})
		return
	}

	ctx.JSON(http.StatusOK, policyDefinition)
}

func createPolicy(ctx *gin.Context) {
	policyDefinition := api.PolicyDefinition{}
	if err := ctx.BindJSON(&policyDefinition); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": err.Error(),
		})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)

	policyDefinition.ID = uuid.New().String()
	if policyDefinition.PrivateProperties == nil {
		policyDefinition.PrivateProperties = map[string]string{}
	}
	policyDefinition.PrivateProperties["createdBy"] = claims.Subject

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)
	createdPolicy, err := edcApi.CreatePolicy(policyDefinition)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_create_policy",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, createdPolicy)
}

func deletePolicy(ctx *gin.Context) {
	id := ctx.Param("id")

	edcApi := ctx.MustGet("edc-api").(*api.EdcAPI)

	policy, err := edcApi.GetPolicy(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_policy",
			"message": err.Error(),
		})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	if policy.Policy.Assigner != claims.Subject {
		ctx.JSON(http.StatusForbidden, gin.H{
			"status":  http.StatusForbidden,
			"error":   "forbidden",
			"message": "You are not allowed to delete this policy",
		})
		return
	}

	err = edcApi.DeletePolicy(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_delete_policy",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusNoContent, gin.H{
		"id": id,
	})
}

func addPoliciesRoutes(r *gin.RouterGroup) {
	policiesGroup := r.Group("/api/portal/policies")
	policiesGroup.GET("/", getPolicies)
	policiesGroup.GET("/:id", getPolicy)
	policiesGroup.POST("/", createPolicy)
	policiesGroup.DELETE("/:id", deletePolicy)
}
