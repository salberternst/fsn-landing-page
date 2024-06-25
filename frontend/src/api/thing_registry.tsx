import { HttpError } from "react-admin";

/**
 * Fetches things from the API based on pagination parameters.
 *
 * @param pagination - The pagination parameters.
 * @returns A Promise that resolves to the fetched things.
 * @throws {HttpError} If the API response is not successful.
 */
export const fetchThings = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/registry/things?page=${page}&page_size=${perPage}`
  );

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

/**
 * Fetches a thing from the API registry by its ID.
 *
 * @param id - The ID of the thing to fetch.
 * @returns A Promise that resolves to the fetched thing.
 * @throws {HttpError} If the API request fails.
 */
export const fetchThing = async (id: string) => {
  const response = await fetch(`/api/registry/things/${id}`);

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

export const fetchThingCredentials = async (id: string, security: string) => {
  const response = await fetch(
    `/api/registry/things/${id}/${security}/credentials`
  );

  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

export const updateThing = async (thing: any) => {
  const response = await fetch(`/api/registry/things/${thing.id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thing),
    method: "PUT",
  });

  if (response.ok === false) {
    throw new HttpError(response.statusText, response.status);
  }

  return thing;
};

export const deleteThing = async (id: any) => {
  const response = await fetch(`/api/registry/things/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  });

  if (response.ok === false) {
    throw new HttpError(response.statusText, response.status);
  }
};

export const createThing = async (thing: any) => {
  const response = await fetch(`/api/registry/things`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thing),
    method: "POST",
  });

  if (response.ok === false) {
    throw new HttpError(response.statusText, response.status);
  }

  return response.json();
};
