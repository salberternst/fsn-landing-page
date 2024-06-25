import { HttpError } from "react-admin";

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