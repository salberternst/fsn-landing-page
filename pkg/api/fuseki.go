package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type FusekiAPI struct {
	client   *resty.Client
	username string `env:"FUSEKI_USERNAME"`
	password string `env:"FUSEKI_PASSWORD"`
	url      string `env:"FUSEKI_URL"`
}

type FusekiDataset struct {
	Name  string `json:"ds.name"`
	State bool   `json:"ds.state"`
}

func NewFusekiAPI() *FusekiAPI {
	return &FusekiAPI{
		client:   resty.New(),
		username: "admin",
		password: "fuseki",
		url:      "http://fuseki:3030",
	}
}

func (f *FusekiAPI) CreateDataset(name string) error {
	resp, err := f.client.R().
		SetHeader("Content-Type", "application/x-www-form-urlencoded").
		SetBasicAuth(f.username, f.password).
		SetBody("dbName=" + name + "&dbType=tdb2").
		Post(f.url + "/$/datasets")

	if err != nil {
		return err
	}

	if resp.StatusCode() != 200 {
		return fmt.Errorf("unable to create dataset: %s", resp.String())
	}

	return err
}

func (f *FusekiAPI) DeleteDataset(name string) error {
	resp, err := f.client.R().
		SetBasicAuth(f.username, f.password).
		Delete(f.url + "/$/datasets/" + name)

	if err != nil {
		return err
	}

	if resp.StatusCode() != 200 {
		return fmt.Errorf("unable to delete dataset: %s", resp.String())
	}

	return err
}

func (f *FusekiAPI) GetDataset(name string) (FusekiDataset, error) {
	var dataset FusekiDataset

	resp, err := f.client.R().
		SetBasicAuth(f.username, f.password).
		SetResult(&dataset).
		Get(f.url + "/$/datasets/" + name)

	if err != nil {
		return FusekiDataset{}, err
	}

	if resp.StatusCode() != 200 {
		return FusekiDataset{}, fmt.Errorf(resp.String())
	}

	return dataset, err
}
