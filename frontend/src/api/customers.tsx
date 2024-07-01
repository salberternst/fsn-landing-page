import { HttpError } from "react-admin";

/**
 * Fetches customers from the server based on the provided pagination parameters.
 * @param pagination - The pagination parameters for fetching customers.
 * @returns A Promise that resolves to the fetched customers.
 * @throws {HttpError} If the server returns an error response.
 */

export const fetchCustomers = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/customers?page=${page}&page_size=${perPage}`,
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
 * Fetches a customer by their ID from the API.
 *
 * @param id - The ID of the customer to fetch.
 * @returns A Promise that resolves to the customer data.
 * @throws {HttpError} If the API request fails.
 */
export const fetchCustomer = async (id: string) => {
  const response = await fetch(`/api/portal/customers/${id}`, {
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
 * Deletes a customer with the specified ID.
 * @param {string} id - The ID of the customer to delete.
 * @returns {Promise<any>} - A promise that resolves to the JSON response from the server.
 * @throws {HttpError} - If the server returns an error response.
 */
export const deleteCustomer = async (id: string): Promise<any> => {
  const response = await fetch(`/api/portal/customers/${id}`, {
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
 * Creates a new customer by sending a POST request to the server.
 * @param data - The data of the customer to be created.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const createCustomer = async (data: any) => {
  const response = await fetch(`/api/portal/customers`, {
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

/**
 * Updates a customer by sending a PUT request to the server.
 * @param id - The ID of the customer to update.
 * @param data - The data of the customer to be updated.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const updateCustomer = async (id: string, data: any) => {
  const response = await fetch(`/api/portal/customers/${id}`, {
    method: "PUT",
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
