import { HttpError } from "react-admin";

/**
 * Fetches transfer processes from the server.
 *
 * @param pagination - The pagination options for fetching the transfer processes.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchTransferProcesses = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/transferprocesses?page=${page}&page_size=${perPage}`,
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
 * Fetches a transfer process by its ID from the server.
 *
 * @param id - The ID of the transfer process to fetch.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchTransferProcess = async (id: string) => {
  const response = await fetch(`/api/portal/transferprocesses/${id}`, {
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
 * Creates a transfer process by sending a POST request to the specified API endpoint.
 * @param {any} data - The data to be sent in the request body.
 * @returns {Promise<any>} - A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} - If the response status is not ok, an HttpError is thrown with the error message and status code.
 */
export const createTransferProcess = async (data: any): Promise<any> => {
  const response = await fetch(`/api/portal/transferprocesses`, {
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
