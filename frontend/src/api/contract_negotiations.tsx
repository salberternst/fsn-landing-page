import { HttpError } from "react-admin";

/**
 * Creates a contract definition by sending a POST request to the server.
 * @param {any} data - The data to be sent in the request body.
 * @returns {Promise<any>} - A promise that resolves to the response JSON.
 * @throws {HttpError} - If the response status is not ok, an HttpError is thrown with the error message and status code.
 */
export const createContractNegotiation = async (data: any): Promise<any> => {
  const response = await fetch(`/api/contractnegotiations`, {
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
 * Fetches a contract negotiation by its ID.
 *
 * @param id - The ID of the contract negotiation to fetch.
 * @returns A Promise that resolves to the fetched contract negotiation.
 * @throws {HttpError} If the response status is not ok, an HttpError is thrown with the error message and status code.
 */
export const fetchContractNegotiation = async (id: string): Promise<any> => {
  const response = await fetch(`/api/contractnegotiations/${id}`);
  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
