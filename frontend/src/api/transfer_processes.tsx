import { HttpError } from "react-admin";


export const fetchTransferProcesses = async (pagination: any) => {
    const { page, perPage }: { page: number; perPage: number } = pagination;
    const response = await fetch(
        `/api/transferprocesses?page=${page}&page_size=${perPage}`,
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

export const fetchTransferProcess = async (id: string) => {
    const response = await fetch(`/api/transferprocesses/${id}`, {
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

export const createTransferProcess = async (data: any) => {
    const response = await fetch(`/api/transferprocesses`, {
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