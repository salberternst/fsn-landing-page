import { HttpError } from "react-admin";


export const fetchUsers = async (pagination: any) => {
    const { page, perPage }: { page: number; perPage: number } = pagination;
    const response = await fetch(
        `/api/users?page=${page}&page_size=${perPage}`,
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
}

export const fetchUser = async (id: string) => {
    const response = await fetch(`/api/users/${id}`, {
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