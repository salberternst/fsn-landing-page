import { HttpError } from "react-admin";

/**
 * Fetches devices from the API based on the provided pagination parameters.
 *
 * @param pagination - The pagination parameters for fetching devices.
 * @returns A Promise that resolves to the JSON response from the API.
 * @throws {HttpError} If the API response is not successful.
 */
export const fetchDevices = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/portal/devices?page=${page}&page_size=${perPage}`,
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
 * Fetches a device from the API based on the provided ID.
 *
 * @param id - The ID of the device to fetch.
 * @returns A Promise that resolves to the fetched device data.
 * @throws {HttpError} If the API request fails.
 */
export const fetchDevice = async (id: string) => {
  const response = await fetch(`/api/portal/devices/${id}`, {
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
 * Creates a new device.
 *
 * @param data - The data for the new device.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const createDevice = async (data: any) => {
  const response = await fetch(`/api/portal/devices`, {
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
 * Deletes a device with the specified ID.
 *
 * @param {string} id - The ID of the device to delete.
 * @returns {Promise<any>} - A promise that resolves to the JSON response from the server.
 * @throws {HttpError} - If the server returns an error response.
 */
export const deleteDevice = async (id: string): Promise<any> => {
  const response = await fetch(`/api/portal/devices/${id}`, {
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
 * Updates a device with the specified ID.
 *
 * @param {string} id - The ID of the device to update.
 * @param {any} data - The data to update the device with.
 * @returns {Promise<any>} - A promise that resolves to the updated device data.
 * @throws {HttpError} - If the server returns an error response.
 */
export const updateDevice = async (id: string, data: any): Promise<any> => {
  const response = await fetch(`/api/portal/devices/${id}`, {
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
