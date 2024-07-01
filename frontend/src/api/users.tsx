import { HttpError } from "react-admin";

/**
 * Fetches users from the API based on the provided pagination parameters.
 *
 * @param pagination - The pagination parameters for fetching users.
 * @returns A Promise that resolves to the JSON response from the API.
 * @throws {HttpError} If the API response is not successful.
 */
export const fetchUsers = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/users?page=${page}&page_size=${perPage}`,
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
 * Fetches a user from the server.
 * @param id - The ID of the user to fetch.
 * @returns A Promise that resolves to the user object.
 * @throws {HttpError} If the server returns an error response.
 */
export const fetchUser = async (id: string) => {
  const response = await fetch(`/api/portal/users/${id}`, {
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
