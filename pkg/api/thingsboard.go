package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type ThingsboardId struct {
	ID         string `json:"id"`
	EntityType string `json:"entityType"`
}

type ThingsboardCustomer struct {
	Id       *ThingsboardId `json:"id,omitempty"`
	Title    string         `json:"title"`
	Name     string         `json:"name"`
	Email    string         `json:"email,omitempty"`
	Phone    string         `json:"phone,omitempty"`
	Country  string         `json:"country,omitempty"`
	State    string         `json:"state,omitempty"`
	City     string         `json:"city,omitempty"`
	Address  string         `json:"address,omitempty"`
	Address2 string         `json:"address2,omitempty"`
	Zip      string         `json:"zip,omitempty"`
}

type ExchangeTokenResponse struct {
	Token     string `json:"token"`
	TokenType string `json:"type,omitempty"`
}

type ThingsboardAPI struct {
	client *resty.Client
}

func NewThingsboardAPI() *ThingsboardAPI {
	return &ThingsboardAPI{
		client: resty.New(),
	}
}

func (tb *ThingsboardAPI) ExchangeToken(accessToken string) (string, error) {
	var exchangeTokenResponse ExchangeTokenResponse

	resp, err := tb.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(`{"username": "oauth2-token", "password": "` + accessToken + `"}`).
		SetResult(&exchangeTokenResponse).
		Post("http://thingsboard-oauth-tokens:3000/api/auth/login")

	if err != nil {
		return "", err
	}

	if resp.StatusCode() != 200 {
		return "", fmt.Errorf("unable to exchange token: %s", resp.String())
	}

	return exchangeTokenResponse.Token, nil
}

func (tb *ThingsboardAPI) CreateCustomer(accessToken string, customer ThingsboardCustomer) (ThingsboardCustomer, error) {
	thingsboardToken, err := tb.ExchangeToken(accessToken)
	if err != nil {
		return ThingsboardCustomer{}, err
	}

	var createdCustomer ThingsboardCustomer

	resp, err := tb.client.R().
		SetHeader("Content-Type", "application/json").
		SetHeader("X-Authorization", "Bearer "+thingsboardToken).
		SetBody(customer).
		SetResult(&createdCustomer).
		Post("http://thingsboard:9090/api/customer")

	if err != nil {
		return ThingsboardCustomer{}, err
	}

	if resp.StatusCode() != 200 {
		return ThingsboardCustomer{}, fmt.Errorf("unable to create customer: %s", resp.String())
	}

	fmt.Println(createdCustomer.Id.ID)

	return createdCustomer, nil
}

func (tb *ThingsboardAPI) DeleteCustomer(accessToken string, customerID string) error {
	thingsboardToken, err := tb.ExchangeToken(accessToken)
	if err != nil {
		return err
	}

	resp, err := tb.client.R().
		SetHeader("Content-Type", "application/json").
		SetHeader("X-Authorization", "Bearer "+thingsboardToken).
		Delete("http://thingsboard:9090/api/customer/" + customerID)

	if err != nil {
		return err
	}

	if resp.StatusCode() != 200 {
		return fmt.Errorf("unable to delete customer: %s", resp.String())
	}

	return nil
}

func (tb *ThingsboardAPI) GetCustomer(accessToken string, customerID string) (ThingsboardCustomer, error) {
	thingsboardToken, err := tb.ExchangeToken(accessToken)
	if err != nil {
		return ThingsboardCustomer{}, err
	}

	var customer ThingsboardCustomer

	resp, err := tb.client.R().
		SetHeader("Content-Type", "application/json").
		SetHeader("X-Authorization", "Bearer "+thingsboardToken).
		SetResult(&customer).
		Get("http://thingsboard:9090/api/customer/" + customerID)

	if err != nil {
		return ThingsboardCustomer{}, err
	}

	if resp.StatusCode() != 200 {
		return ThingsboardCustomer{}, fmt.Errorf("unable to get customer: %s", resp.String())
	}

	return customer, nil
}
