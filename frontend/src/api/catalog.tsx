import { HttpError } from "react-admin";

export const fetchCatalog = async (edcAddress: string) => {
  const response = await fetch(`/management/v2/catalog/request`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      "@context": {
        "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      },
      counterPartyAddress: edcAddress,
      protocol: "dataspace-protocol-http",
    }),
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  if (!Array.isArray(json["dcat:dataset"])) {
    json["dcat:dataset"] = [json["dcat:dataset"]];
  }

  if (!Array.isArray(json["dcat:service"])) {
    json["dcat:service"] = [json["dcat:service"]];
  }

  for (let dataset of json["dcat:dataset"]) {
    if (!Array.isArray(dataset["dcat:distribution"])) {
      dataset["dcat:distribution"] = [dataset["dcat:distribution"]];
    }
    if (!Array.isArray(dataset["odrl:hasPolicy"])) {
      dataset["odrl:hasPolicy"] = [dataset["odrl:hasPolicy"]];
    }
  }

  return json;
};
