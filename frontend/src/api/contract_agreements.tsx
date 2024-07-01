import { HttpError } from "react-admin";

/**
 * Fetches contract agreements from the server.
 *
 * @param pagination - The pagination options for fetching the contract agreements.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchContractAgreements = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/contractagreements?page=${page}&page_size=${perPage}`,
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
 * Fetches a contract agreement by its ID.
 *
 * @param {string} id - The ID of the contract agreement to fetch.
 * @returns {Promise<any>} - A promise that resolves to the fetched contract agreement.
 * @throws {HttpError} - If the request fails or returns an error response.
 */
export const fetchContractAgreement = async (id: string) => {
  const response = await fetch(`/api/portal/contractagreements/${id}`);
  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Fetches the contract agreement negotiation data from the server.
 *
 * @param id - The ID of the contract agreement.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchContractAgreementNegotiation = async (id: string) => {
  const response = await fetch(
    `/api/portal/contractagreements/${id}/negotiation`
  );
  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
