package routes

import (
	"fmt"
	"net/http"

	"github.com/Nerzal/gocloak/v13"
	"github.com/gin-gonic/gin"
	"github.com/salberternst/fsn_landing_page/pkg/middleware"
)

type RealmRoleMapping struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Composite   bool   `json:"composite"`
	ClientRole  bool   `json:"clientRole"`
	ContainerId string `json:"containerId"`
}

type Group struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type User struct {
	Id               string             `json:"id,omitempty"`
	Email            string             `json:"email"`
	EmailVerified    bool               `json:"emailVerified,omitempty"`
	FirstName        string             `json:"firstName"`
	LastName         string             `json:"lastName"`
	Group            string             `json:"group,omitempty"`
	IsAdmin          bool               `json:"isAdmin,omitempty"`
	RealmRoleMapping []RealmRoleMapping `json:"realmRoleMapping,omitempty"`
	Groups           []Group            `json:"groups,omitempty"`
}

func getUsers(ctx *gin.Context) {
	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)
	keycloakToken := ctx.MustGet("keycloak-token").(string)

	briefRepresentation := false
	keycloakUsers, err := client.GetUsers(ctx, keycloakToken, "dataspace", gocloak.GetUsersParams{
		BriefRepresentation: &briefRepresentation,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "internal_server_error",
			"error":   err.Error(),
			"message": "Failed to get users",
		})
		return
	}

	users := []User{}
	for _, keycloakUser := range keycloakUsers {
		users = append(users, User{
			Id:            *keycloakUser.ID,
			Email:         *keycloakUser.Email,
			EmailVerified: *keycloakUser.EmailVerified,
			FirstName:     *keycloakUser.FirstName,
			LastName:      *keycloakUser.LastName,
		})
	}

	ctx.JSON(http.StatusOK, users)
}

func getUser(ctx *gin.Context) {
	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)
	keycloakToken := ctx.MustGet("keycloak-token").(string)
	claims := ctx.MustGet("access-token-claims").(*middleware.Claims)

	userId := ctx.Param("id")

	keycloakUser, err := client.GetUserByID(ctx, keycloakToken, "dataspace", userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_user",
			"message": fmt.Sprintf("Failed to get user: %s", err.Error()),
		})
		return
	}

	query := fmt.Sprintf("tenant-id:%s", claims.TenantId)
	briefRepresentation := false
	groups, err := client.GetUserGroups(ctx, keycloakToken, "dataspace", userId, gocloak.GetGroupsParams{
		BriefRepresentation: &briefRepresentation,
		Q:                   &query,
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  http.StatusInternalServerError,
			"error":   "unable_to_get_user_groups",
			"message": fmt.Sprintf("Failed to get user groups: %s", err.Error()),
		})
		return
	}

	userGroups := []Group{}
	for _, group := range groups {
		userGroups = append(userGroups, Group{
			Id:   *group.ID,
			Name: *group.Name,
		})
	}

	fmt.Println(groups)

	user := User{
		Id:            *keycloakUser.ID,
		Email:         *keycloakUser.Email,
		EmailVerified: *keycloakUser.EmailVerified,
		FirstName:     *keycloakUser.FirstName,
		LastName:      *keycloakUser.LastName,
		Groups:        userGroups,
	}

	ctx.JSON(http.StatusOK, user)
}

func createUser(ctx *gin.Context) {
	user := User{}
	if err := ctx.BindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  http.StatusBadRequest,
			"error":   "bad_request",
			"message": fmt.Sprintf("Failed to bind JSON: %s", err.Error()),
		})
		return
	}

	keycloakToken := ctx.GetHeader("Authorization")
	client := ctx.MustGet("keycloak-client").(*gocloak.GoCloak)

	userId, err := client.CreateUser(ctx, keycloakToken, "dataspace", gocloak.User{
		Email:         &user.Email,
		EmailVerified: &user.EmailVerified,
		FirstName:     &user.FirstName,
		LastName:      &user.LastName,
		Groups:        &[]string{user.Group},
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "internal_server_error",
			"error":   err.Error(),
			"message": "Failed to create user",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"id": userId,
	})
}

func addUsersRoute(r *gin.RouterGroup) {
	usersGroup := r.Group("/api/users")
	usersGroup.GET("/", getUsers)
	usersGroup.POST("/", createUser)
	usersGroup.GET("/:id", getUser)
}
