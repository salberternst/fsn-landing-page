import { HttpError } from "react-admin";

/**
 * Fetches the catalog data from the server.
 *
 * @param edcAddress - The EDC address.
 * @returns A Promise that resolves to the catalog data.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchCatalog = async (edcAddress: string) => {
  const response = await fetch(`/api/portal/catalog`, {
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
    for (let policy of dataset["odrl:hasPolicy"]) {
      if (!Array.isArray(policy["odrl:permission"])) {
        policy["odrl:permission"] = [policy["odrl:permission"]];
      }
      if (!Array.isArray(policy["odrl:constraint"])) {
        policy["odrl:constraint"] = [policy["odrl:constraint"]];
      }
    }
  }

  return json;
};

/**
 * Fetches a catalog dataset from the server.
 *
 * @param {string} edcAddress - The EDC address.
 * @param {string} assetId - The asset ID.
 * @returns {Promise<any>} - A promise that resolves to the fetched catalog dataset.
 * @throws {HttpError} - If the response is not successful.
 */
export const fetchCatalogDataset = async (
  edcAddress: string,
  assetId: string
) => {
  const response = await fetch(`/api/portal/catalog/dataset`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      "@context": {
        "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
      },
      "@type": "DatasetRequest",
      "@id": assetId,
      counterPartyAddress: edcAddress,
      protocol: "dataspace-protocol-http",
    }),
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
