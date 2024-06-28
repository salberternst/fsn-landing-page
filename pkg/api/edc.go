package api

import (
	"encoding/json"
	"fmt"

	"github.com/go-resty/resty/v2"
)

type EdcAPI struct {
	client *resty.Client
}

// "@type": "Criterion",
// "operandLeft": "https://w3id.org/edc/v0.0.1/ns/id",
// "operator": "=",
// "operandRight": "assetId"
type Criterion struct {
	Type         string `json:"@type"`
	OperandLeft  string `json:"operandLeft"`
	OperandRight string `json:"operandRight"`
	Operator     string `json:"operator"`
}

type QuerySpec struct {
	Context map[string]string `json:"@context"`
	Type    string            `json:"@type"`
	Offset  uint              `json:"offset"`
	Limit   uint              `json:"limit"`
	// SortOrder        string            `json:"sortOrder"`
	// SortField        string            `json:"sortField"`
	FilterExpression []Criterion `json:"filterExpression"`
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
	Context           *interface{}      `json:"@context"`
	CreatedAt         uint              `json:"createdAt"`
	ID                string            `json:"@id"`
	Type              string            `json:"@type"`
	Policy            Policy            `json:"policy"`
	PrivateProperties map[string]string `json:"privateProperties,omitempty"`
}

type Asset struct {
	Context           *interface{}      `json:"@context"`
	Id                string            `json:"@id,omitempty"`
	Type              string            `json:"@type,omitempty"`
	DataAddress       map[string]string `json:"dataAddress"`
	PrivateProperties map[string]string `json:"privateProperties,omitempty"`
	Properties        map[string]string `json:"properties"`
}

type ContractDefinition struct {
	Context           *interface{}      `json:"@context"`
	Id                string            `json:"@id,omitempty"`
	Type              string            `json:"@type,omitempty"`
	AccessPolicyId    string            `json:"accessPolicyId"`
	AssetsSelector    AssetSelector     `json:"assetsSelector,omitempty"`
	ContractPolicyId  string            `json:"contractPolicyId"`
	PrivateProperties map[string]string `json:"privateProperties,omitempty"`
}

type AssetSelector []Criterion

func (a *AssetSelector) UnmarshalJSON(data []byte) error {
	var single Criterion
	if err := json.Unmarshal(data, &single); err == nil {
		*a = AssetSelector{single}
		return nil
	}

	var multiple []Criterion
	if err := json.Unmarshal(data, &multiple); err == nil {
		*a = multiple
		return nil
	}

	return fmt.Errorf("failed to unmarshal AssetSelector")
}

type CallbackAddress struct {
	Type          string   `json:"@type,omitempty"`
	AuthCodeId    string   `json:"authCodeId,omitempty"`
	AuthKey       string   `json:"authKey,omitempty"`
	Events        []string `json:"events,omitempty"`
	Transactional bool     `json:"transactional,omitempty"`
	Uri           string   `json:"uri,omitempty"`
}

type ContractNegotiation struct {
	Context             *interface{}      `json:"@context"`
	Id                  string            `json:"@id,omitempty"`
	Type                string            `json:"@type,omitempty"`
	CallbackAddresses   []CallbackAddress `json:"callbackAddresses,omitempty"`
	ContractAgreementId string            `json:"contractAgreementId,omitempty"`
	CounterPartyAddress string            `json:"counterPartyAddress,omitempty"`
	CounterPartyId      string            `json:"counterPartyId,omitempty"`
	ErrorDetail         string            `json:"errorDetail,omitempty"`
	Protocol            string            `json:"protocol,omitempty"`
	State               string            `json:"state,omitempty"`
	PrivateProperties   map[string]string `json:"privateProperties,omitempty"`
}

type ContractOfferDescription struct {
	Type_   string  `json:"@type,omitempty"`
	AssetId string  `json:"assetId,omitempty"`
	OfferId string  `json:"offerId,omitempty"`
	Policy  *Policy `json:"policy,omitempty"`
}

type Offer struct {
	Context  *interface{} `json:"@context"`
	Id       string       `json:"@id"`
	Type_    string       `json:"@type,omitempty"`
	Assigner string       `json:"assigner"`
	Target   string       `json:"target"`
}

type ContractRequest struct {
	Context             *interface{}              `json:"@context"`
	Type_               string                    `json:"@type,omitempty"`
	CallbackAddresses   []CallbackAddress         `json:"callbackAddresses,omitempty"`
	ConnectorAddress    string                    `json:"connectorAddress,omitempty"`
	CounterPartyAddress string                    `json:"counterPartyAddress"`
	Offer               *ContractOfferDescription `json:"offer,omitempty"`
	Policy              *Offer                    `json:"policy"`
	Protocol            string                    `json:"protocol"`
	ProviderId          string                    `json:"providerId,omitempty"`
	PrivateProperties   map[string]string         `json:"privateProperties,omitempty"`
}

type ContractAgreement struct {
	Id                  string  `json:"@id,omitempty"`
	Type_               string  `json:"@type,omitempty"`
	AssetId             string  `json:"assetId,omitempty"`
	ConsumerId          string  `json:"consumerId,omitempty"`
	ContractSigningDate int64   `json:"contractSigningDate,omitempty"`
	Policy              *Policy `json:"policy,omitempty"`
	ProviderId          string  `json:"providerId,omitempty"`
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

func (e *EdcAPI) GetContractDefinitions(querySpec QuerySpec) ([]ContractDefinition, error) {
	var contractsDefinitions []ContractDefinition
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(querySpec).
		SetResult(&contractsDefinitions).
		Post("http://edc-provider:19193/management/v2/contractdefinitions/request")

	fmt.Println(resp)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to get contracts: %s", resp.String())
	}

	return contractsDefinitions, nil
}

func (e *EdcAPI) GetContractDefinition(id string) (*ContractDefinition, error) {
	contractDefinition := ContractDefinition{}
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetResult(&contractDefinition).
		Get("http://edc-provider:19193/management/v2/contractdefinitions/" + id)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to get contract: %s", resp.String())
	}

	return &contractDefinition, nil
}

func (e *EdcAPI) DeleteContractDefinition(id string) error {
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		Delete("http://edc-provider:19193/management/v2/contractdefinitions/" + id)

	if err != nil {
		return err
	}

	if resp.StatusCode() != 204 {
		return fmt.Errorf("unable to delete contract: %s", resp.String())
	}

	return nil
}

func (e *EdcAPI) CreateContractDefinition(contractDefinition ContractDefinition) (*ContractDefinition, error) {
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(contractDefinition).
		SetResult(&contractDefinition).
		Post("http://edc-provider:19193/management/v2/contractdefinitions")

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to create contract: %s", resp.String())
	}

	return &contractDefinition, nil
}

func (e *EdcAPI) CreateContractNegotiation(contractNegotiation ContractRequest) (*ContractAgreement, error) {
	var contractAgreement ContractAgreement

	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetBody(contractNegotiation).
		SetResult(&contractAgreement).
		Post("http://edc-provider:19193/management/v2/contractnegotiations")

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to create contract negotiation: %s", resp.String())
	}

	return &contractAgreement, nil
}

func (e *EdcAPI) GetContractNegotiation(id string) (*ContractNegotiation, error) {
	contractNegotiation := ContractNegotiation{}
	resp, err := e.client.R().
		SetHeader("Content-Type", "application/json").
		SetResult(&contractNegotiation).
		Get("http://edc-provider:19193/management/v2/contractnegotiations/" + id)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("unable to get contract negotiation: %s", resp.String())
	}

	return &contractNegotiation, nil
}
