import { HttpError } from "react-admin";

/**
 * Executes a SPARQL query by sending a request to the server.
 * @param query - The SPARQL query string.
 * @returns A Promise that resolves to the JSON response from the server.
 * @throws {HttpError} If the server returns an error response.
 */
export const querySparql = async (query: string) => {
    const response = await fetch(`/api/sparql?query=${encodeURIComponent(query)}`, {
        headers: {
            "Content-Type": "application/json",
        }
    });

    const json = await response.json();
    if (response.ok === false) {
        throw new HttpError(json.message, response.status);
    }

    return json;
}