import { HttpError } from "react-admin";

export const fetchPolicies = async (pagination: any) => {
    const { page, perPage }: { page: number; perPage: number } = pagination;
    const response = await fetch(
      `/api/policies?page=${page}&page_size=${perPage}`,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
  
    const json = await response.json();
    if (response.ok === false) {
      throw new HttpError(json.message, response.status);
    }
  
    return json;
}

export const fetchPolicy = async (id: string) => {
    const response = await fetch(`/api/policies/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const json = await response.json();
    if (response.ok === false) {
      throw new HttpError(json.message, response.status);
    }
  
    return json;
}

export const deletePolicy = async (id: string) => {
    const response = await fetch(`/api/policies/${id}`, {
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
}

export const createPolicy = async (data: any) => {
    const response = await fetch(`/api/policies`, {
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
}
