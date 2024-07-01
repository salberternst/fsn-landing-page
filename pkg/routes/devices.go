package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/api"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

type CreateDevice struct {
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Gateway     bool   `json:"gateway,omitempty"`
	ThingModel  string `json:"thingModel,omitempty"`
	CustomerId  string `json:"customerId,omitempty"`
}

type UpdateDevice struct {
	Description *string `json:"description,omitempty"`
	Gateway     *bool   `json:"gateway,omitempty"`
	ThingModel  *string `json:"thingModel,omitempty"`
	Customer    *string `json:"customer,omitempty"`
}

func getDevices(ctx *gin.Context) {
	thingsboardApi := ctx.MustGet("thingsboard-api").(*api.ThingsboardAPI)
	accessToken := ctx.MustGet("access-token").(string)
	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)

	var devices map[string]interface{}
	var err error

	if claims.CustomerId == "" {
		devices, err = thingsboardApi.GetTenantDevices(accessToken)
	} else {
		devices, err = thingsboardApi.GetCustomerDevices(accessToken, claims.CustomerId)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_devices",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, devices)
}

func getDevice(ctx *gin.Context) {
	thingsboardApi := ctx.MustGet("thingsboard-api").(*api.ThingsboardAPI)
	accessToken := ctx.MustGet("access-token").(string)
	deviceId := ctx.Param("id")

	device, err := thingsboardApi.GetDevice(accessToken, deviceId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_device",
			"message": err.Error(),
		})
		return
	}

	deviceAttributes, err := thingsboardApi.GetDeviceAttributes(accessToken, deviceId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_device_attributes",
			"message": err.Error(),
		})
		return
	}

	deviceCredentials, err := thingsboardApi.GetDeviceCredentials(accessToken, deviceId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_device_credentials",
			"message": err.Error(),
		})
		return
	}

	device["attributes"] = deviceAttributes
	device["credentials"] = deviceCredentials

	ctx.JSON(http.StatusOK, device)
}

func createDevice(ctx *gin.Context) {
	thingsboardApi := ctx.MustGet("thingsboard-api").(*api.ThingsboardAPI)
	accessToken := ctx.MustGet("access-token").(string)

	createDevice := CreateDevice{}
	if err := ctx.BindJSON(&createDevice); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": err.Error(),
		})
		return
	}

	thingsboardCreateDevice := api.ThingsboardDevice{
		Name: createDevice.Name,
		AdditionalInfo: map[string]interface{}{
			"gateway":     createDevice.Gateway,
			"description": createDevice.Description,
			"customerId": map[string]string{
				"id":         createDevice.CustomerId,
				"entityType": "CUSTOMER",
			},
		},
	}

	createdDevice, err := thingsboardApi.CreateDevice(accessToken, thingsboardCreateDevice)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_create_device",
			"message": err.Error(),
		})
		return
	}

	attributes := make(map[string]interface{})
	attributes["thing-model"] = createDevice.ThingModel

	deviceId := createdDevice["id"].(map[string]interface{})["id"].(string)

	err = thingsboardApi.CreateDeviceAttributes(accessToken, deviceId, attributes)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_create_device_attributes",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, createdDevice)
}

func deleteDevice(ctx *gin.Context) {
	thingsboardApi := ctx.MustGet("thingsboard-api").(*api.ThingsboardAPI)
	accessToken := ctx.MustGet("access-token").(string)
	deviceId := ctx.Param("id")

	err := thingsboardApi.DeleteDevice(accessToken, deviceId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_delete_device",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"id": deviceId})
}

func updateDevice(ctx *gin.Context) {
	thingsboardApi := ctx.MustGet("thingsboard-api").(*api.ThingsboardAPI)
	accessToken := ctx.MustGet("access-token").(string)
	deviceId := ctx.Param("id")

	updateDevice := UpdateDevice{}
	if err := ctx.BindJSON(&updateDevice); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": err.Error(),
		})
		return
	}

	device, err := thingsboardApi.GetDevice(accessToken, deviceId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_device",
			"message": err.Error(),
		})
		return
	}

	if updateDevice.Description != nil {
		device["additionalInfo"].(map[string]interface{})["description"] = updateDevice.Description
	}

	if updateDevice.Gateway != nil {
		device["additionalInfo"].(map[string]interface{})["gateway"] = updateDevice.Gateway
	}

	if updateDevice.Customer != nil {
		device["customerId"] = map[string]string{
			"id":         *updateDevice.Customer,
			"entityType": "CUSTOMER",
		}
	}

	err = thingsboardApi.UpdateDevice(accessToken, deviceId, device)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_update_device",
			"message": err.Error(),
		})
		return
	}

	if updateDevice.ThingModel != nil {
		attributes := make(map[string]interface{})
		attributes["thing-model"] = updateDevice.ThingModel

		err = thingsboardApi.CreateDeviceAttributes(accessToken, deviceId, attributes)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  http.StatusInternalServerError,
				"error":   "unable_to_create_device_attributes",
				"message": err.Error(),
			})
			return
		}
	} else {
		err = thingsboardApi.DeleteDeviceAttribute(accessToken, deviceId, "thing-model")
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"status":  http.StatusInternalServerError,
				"error":   "unable_to_delete_device_attribute",
				"message": err.Error(),
			})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"id": deviceId})
}

func addDevicesRoutes(r *gin.RouterGroup) {
	devicesGroup := r.Group("/api/portal/devices")
	devicesGroup.GET("/", getDevices)
	devicesGroup.GET("/:id", getDevice)
	devicesGroup.POST("/", createDevice)
	devicesGroup.DELETE("/:id", deleteDevice)
	devicesGroup.PUT("/:id", updateDevice)
}
