import { HttpError } from "react-admin";

/**
 * Fetches contract definitions from the server.
 *
 * @param pagination - The pagination options for fetching the contract definitions.
 * @returns A Promise that resolves to the fetched contract definitions.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchContractDefinitions = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/contractdefinitions?page=${page}&page_size=${perPage}`,
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
 * Fetches a contract definition from the server.
 *
 * @param id - The ID of the contract definition to fetch.
 * @returns A Promise that resolves to the fetched contract definition.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchContractDefinition = async (id: string) => {
  const response = await fetch(`/api/portal/contractdefinitions/${id}`, {
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
 * Deletes a contract definition by its ID.
 * @param {string} id - The ID of the contract definition to delete.
 * @returns {Promise<any>} - A promise that resolves to the JSON response from the server.
 * @throws {HttpError} - If the server returns an error response.
 */
export const deleteContractDefinition = async (id: string) => {
  const response = await fetch(`/api/portal/contractdefinitions/${id}`, {
    method: "DELETE",
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
 * Creates a contract definition by sending a POST request to the server.
 * @param {any} data - The data to be sent in the request body.
 * @returns {Promise<any>} - A promise that resolves to the response JSON.
 * @throws {HttpError} - If the response status is not ok, an HttpError is thrown with the error message and status code.
 */
export const createContractDefinition = async (data: any): Promise<any> => {
  const response = await fetch(`/api/portal/contractdefinitions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
