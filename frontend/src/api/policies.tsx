import { HttpError } from "react-admin";

/**
 * Fetches policies from the server.
 *
 * @param pagination - The pagination options for fetching policies.
 * @returns A Promise that resolves to the fetched policies.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchPolicies = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/policies?page=${page}&page_size=${perPage}`,
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
 * Fetches a policy by its ID from the API.
 *
 * @param {string} id - The ID of the policy to fetch.
 * @returns {Promise<any>} - A promise that resolves to the fetched policy.
 * @throws {HttpError} - If the API request fails, an HttpError is thrown with the error message and status code.
 */
export const fetchPolicy = async (id: string): Promise<any> => {
  const response = await fetch(`/api/portal/policies/${id}`, {
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

export const deletePolicy = async (id: string) => {
  const response = await fetch(`/api/portal/policies/${id}`, {
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
 * Creates a new policy.
 *
 * @param data - The data for the new policy.
 * @returns A Promise that resolves to the created policy.
 * @throws {HttpError} If the request fails or returns an error.
 */
export const createPolicy = async (data: any) => {
  const response = await fetch(`/api/portal/policies`, {
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
