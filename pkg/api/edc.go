package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type EdcAPI struct {
	client *resty.Client
}

type Criterion struct {
	Type         string `json:"@type"`
	OperandLeft  string `json:"operandLeft"`
	OperandRight string `json:"operandRight"`
	Operator     string `json:"operator"`
}

type QuerySpec struct {
	Context          map[string]string `json:"@context"`
	Type             string            `json:"@type"`
	Offset           uint              `json:"offset"`
	Limit            uint              `json:"limit"`
	SortOrder        string            `json:"sortOrder"`
	SortField        string            `json:"sortField"`
	FilterExpression []Criterion       `json:"filterExpression"`
}

type Constraint struct {
	Edctype string `json:"edctype"`
}

type Action struct {
	Constraint *Constraint `json:"constraint,omitempty"`
	IncludedIn string      `json:"includedIn,omitempty"`
	Type_      string      `json:"type,omitempty"`
}

type Prohibition struct {
	Action      *Action      `json:"action,omitempty"`
	Assignee    string       `json:"assignee,omitempty"`
	Assigner    string       `json:"assigner,omitempty"`
	Constraints []Constraint `json:"constraints,omitempty"`
	Target      string       `json:"target,omitempty"`
	Uid         string       `json:"uid,omitempty"`
}

type Duty struct {
	Action           *Action      `json:"action,omitempty"`
	Assignee         string       `json:"assignee,omitempty"`
	Assigner         string       `json:"assigner,omitempty"`
	Consequence      *Duty        `json:"consequence,omitempty"`
	Constraints      []Constraint `json:"constraints,omitempty"`
	ParentPermission *Permission  `json:"parentPermission,omitempty"`
	Target           string       `json:"target,omitempty"`
	Uid              string       `json:"uid,omitempty"`
}

type Permission struct {
	Action      *Action      `json:"action,omitempty"`
	Assignee    string       `json:"assignee,omitempty"`
	Assigner    string       `json:"assigner,omitempty"`
	Constraints []Constraint `json:"constraints,omitempty"`
	Duties      []Duty       `json:"duties,omitempty"`
	Target      string       `json:"target,omitempty"`
	Uid         string       `json:"uid,omitempty"`
}

type Policy struct {
	Context              any                    `json:"@context,omitempty"`
	Type                 string                 `json:"@type,omitempty"`
	Assignee             string                 `json:"odrl:assignee,omitempty"`
	Assigner             string                 `json:"odrl:assigner,omitempty"`
	ExtensibleProperties map[string]interface{} `json:"odrl:extensibleProperties,omitempty"`
	InheritsFrom         string                 `json:"odrl:inheritsFrom,omitempty"`
	Obligations          []Duty                 `json:"odrl:obligations,omitempty"`
	Permissions          []Permission           `json:"odrl:permissions,omitempty"`
	Prohibitions         []Prohibition          `json:"odrl:prohibitions,omitempty"`
	Target               string                 `json:"odrl:target,omitempty"`
}

type PolicyDefinition struct {
	Context           map[string]string      `json:"@context"`
	CreatedAt         uint                   `json:"createdAt"`
	ID                string                 `json:"@id"`
	Type              string                 `json:"@type"`
	Policy            Policy                 `json:"policy"`
	PrivateProperties map[string]interface{} `json:"privateProperties,omitempty"`
}

type Asset struct {
	Context           *interface{}      `json:"@context"`
	Id                string            `json:"@id,omitempty"`
	Type              string            `json:"@type,omitempty"`
	DataAddress       map[string]string `json:"dataAddress"`
	PrivateProperties map[string]string `json:"privateProperties,omitempty"`
	Properties        map[string]string `json:"properties"`
}

func NewEdcAPI() *EdcAPI {
	return &EdcAPI{
		client: resty.New(),
	}
}

func (e *EdcAPI) GetPolicies(querySpec QuerySpec) ([]PolicyDefinition, error) {
	var policies []PolicyDefinition
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(querySpec).
		SetResult(&policies).
		Post("http://edc-provider:19193/management/v2/policydefinitions/request")

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to get policies: %s", resp.String())
	}

	return policies, nil
}

func (e *EdcAPI) GetPolicy(id string) (*PolicyDefinition, error) {
	policy := PolicyDefinition{}
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetResult(&policy).
		Get("http://edc-provider:19193/management/v2/policydefinitions/" + id)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to get policy: %s", resp.String())
	}

	return &policy, nil
}

func (e *EdcAPI) CreatePolicy(policy PolicyDefinition) (*PolicyDefinition, error) {
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(policy).
		SetResult(&policy).
		Post("http://edc-provider:19193/management/v2/policydefinitions")

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to create policy: %s", resp.String())
	}

	return &policy, nil
}

func (e *EdcAPI) DeletePolicy(id string) error {
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		Delete("http://edc-provider:19193/management/v2/policydefinitions/" + id)

	if err != nil {
		return err
	}

	if resp.StatusCode() != 204 {
		return fmt.Errorf("unable to delete policy: %s", resp.String())
	}

	return nil
}

func (e *EdcAPI) GetAssets(querySpec QuerySpec) ([]Asset, error) {
	var assets []Asset
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(querySpec).
		SetResult(&assets).
		Post("http://edc-provider:19193/management/v3/assets/request")

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to get assets: %s", resp.String())
	}

	return assets, nil
}

func (e *EdcAPI) GetAsset(id string) (*Asset, error) {
	asset := Asset{}
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetResult(&asset).
		Get("http://edc-provider:19193/management/v3/assets/" + id)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to get asset: %s", resp.String())
	}

	return &asset, nil
}

func (e *EdcAPI) CreateAsset(asset Asset) (*Asset, error) {
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(asset).
		SetResult(&asset).
		Post("http://edc-provider:19193/management/v3/assets")

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to create asset: %s", resp.String())
	}

	return &asset, nil
}

func (e *EdcAPI) DeleteAsset(id string) error {
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		Delete("http://edc-provider:19193/management/v3/assets/" + id)

	if err != nil {
		return err
	}

	if resp.StatusCode() != 204 {
		return fmt.Errorf("unable to delete asset: %s", resp.String())
	}

	return nil
}
