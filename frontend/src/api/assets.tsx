import { HttpError } from "react-admin";

/**
 * Fetches assets from the server based on the provided pagination parameters.
 * @param pagination - The pagination parameters for fetching assets.
 * @returns A Promise that resolves to the fetched assets.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchAssets = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/assets?page=${page}&page_size=${perPage}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Fetches an asset from the server.
 * @param id - The ID of the asset to fetch.
 * @returns A Promise that resolves to the fetched asset.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchAsset = async (id: string) => {
  const response = await fetch(`/api/portal/assets/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Deletes an asset with the specified ID.
 *
 * @param id - The ID of the asset to delete.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const deleteAsset = async (id: string) => {
  const response = await fetch(`/api/portal/assets/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok === false) {
    throw new HttpError(response.statusText, response.status);
  }

  return response;
};

/**
 * Creates a new asset by making a POST request to the server.
 * @param {any} data - The data to be sent in the request body.
 * @returns {Promise<any>} - A promise that resolves to the response JSON.
 * @throws {HttpError} - If the response status is not ok, an HttpError is thrown with the error message and status code.
 */
export const createAsset = async (data: any): Promise<any> => {
  const response = await fetch(`/api/portal/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (response.ok === false) {
    console.log(json);
    throw new HttpError("message", response.status, json);
  }

  return json;
};
