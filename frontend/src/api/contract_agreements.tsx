import { HttpError } from "react-admin";

export const fetchContractAgreements = async (pagination: any) => {
  const { page, perPage }: { page: number; perPage: number } = pagination;
  const response = await fetch(
    `/api/contractagreements?page=${page}&page_size=${perPage}`,
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

export const fetchContractAgreement = async (id: string) => {
  const response = await fetch(`/api/contractagreements/${id}`);
  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};

export const fetchContractAgreementNegotiation = async (id: string) => {
  const response = await fetch(`/api/contractagreements/${id}/negotiation`);
  const json = await response.json();
  if (response.ok === false) {
    throw new HttpError(json.message, response.status);
  }

  return json;
};
