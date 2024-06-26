package routes

import (
	"fmt"
	"net/http"

	"github.com/Nerzal/gocloak/v13"
	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

type Customer struct {
	ID          string `json:"id,omitempty"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type UpdateCustomer struct {
	Description string `json:"description"`
}

type CustomerQuery struct {
	Page     uint `form:"page,default=1" binding:"required"`
	PageSize uint `form:"page_size,default=20" binding:"required"`
}

func getCustomers(ctx *gin.Context) {
	customerQuery := CustomerQuery{}
	if err := ctx.BindQuery(&customerQuery); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)

	// only show groups that have the tenant-id attribute set to the tenant-id of the user
	tenantID := fmt.Sprintf("tenant-id:%s", claims.TenantId)
	briefRepresentation := false

	groups, err := client.GetGroups(ctx, ctx.MustGet("keycloak-token").(string), "dataspace", gocloak.GetGroupsParams{
		Q:                   &tenantID,
		BriefRepresentation: &briefRepresentation,
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// forward only id and name
	customers := make([]Customer, len(groups))
	for i, group := range groups {
		description := ""
		if group.Attributes != nil {
			if desc, ok := (*group.Attributes)["description"]; ok {
				description = desc[0]
			}
		}

		customers[i] = Customer{
			ID:          *group.ID,
			Name:        *group.Name,
			Description: description,
		}
	}

	ctx.JSON(http.StatusOK, customers)
}

func getCustomer(ctx *gin.Context) {
	customerID := ctx.Param("id")

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)

	group, err := client.GetGroup(ctx, ctx.MustGet("keycloak-token").(string), "dataspace", customerID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "customer not found",
			"status":  http.StatusNotFound,
		})
		return
	}

	description := ""
	if group.Attributes != nil {
		tenantId, ok := (*group.Attributes)["tenant-id"]
		if !ok || tenantId[0] != claims.TenantId {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "customer not found",
				"status":  http.StatusNotFound,
			})
			return
		}

		if desc, ok := (*group.Attributes)["description"]; ok {
			description = desc[0]
		}
	} else {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "customer not found",
			"status":  http.StatusNotFound,
		})
		return
	}

	customer := Customer{
		ID:          *group.ID,
		Name:        *group.Name,
		Description: description,
	}

	ctx.JSON(http.StatusOK, customer)
}

func createCustomer(ctx *gin.Context) {
	customer := Customer{}
	if err := ctx.BindJSON(&customer); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)
	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)

	id, err := client.CreateGroup(ctx, ctx.MustGet("keycloak-token").(string), "dataspace", gocloak.Group{
		Name: &customer.Name,
		Attributes: &map[string][]string{
			"tenant-id":   {claims.TenantId},
			"customer-id": {customer.Name},
			"description": {customer.Description},
		},
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"id": id,
	})
}

func deleteCustomer(ctx *gin.Context) {
	customerID := ctx.Param("id")

	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)

	err := client.DeleteGroup(ctx, ctx.MustGet("keycloak-token").(string), "dataspace", customerID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "customer deleted",
		"status":  http.StatusOK,
	})
}

func updateCustomer(ctx *gin.Context) {
	customerID := ctx.Param("id")

	updateCustomer := UpdateCustomer{}
	if err := ctx.BindJSON(&updateCustomer); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)

	group, err := client.GetGroup(ctx, ctx.MustGet("keycloak-token").(string), "dataspace", customerID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "customer not found",
			"status":  http.StatusNotFound,
		})
		return
	}

	if group.Attributes == nil {
		group.Attributes = &map[string][]string{
			"description": {updateCustomer.Description},
		}
	} else if (*group.Attributes)["description"] == nil {
		(*group.Attributes)["description"] = []string{updateCustomer.Description}
	} else {
		(*group.Attributes)["description"][0] = updateCustomer.Description
	}

	err = client.UpdateGroup(ctx, ctx.MustGet("keycloak-token").(string), "dataspace", *group)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "customer updated",
		"status":  http.StatusOK,
	})
}

func addCustomersRoutes(r *gin.RouterGroup) {
	customersGroup := r.Group("/api/customers")
	customersGroup.GET("/", getCustomers)
	customersGroup.GET("/:id", getCustomer)
	customersGroup.POST("/", createCustomer)
	customersGroup.DELETE("/:id", deleteCustomer)
	customersGroup.PUT("/:id", updateCustomer)
}
