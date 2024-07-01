import {
  createAsset,
  deleteAsset,
  fetchAsset,
  fetchAssets,
} from "./api/assets";
import { fetchCatalog, fetchCatalogDataset } from "./api/catalog";
import {
  fetchContractAgreement,
  fetchContractAgreements,
  fetchContractAgreementNegotiation,
} from "./api/contract_agreements";
import {
  createContractDefinition,
  deleteContractDefinition,
  fetchContractDefinition,
  fetchContractDefinitions,
} from "./api/contract_definitions";
import {
  createContractNegotiation,
  fetchContractNegotiation,
} from "./api/contract_negotiations";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomer,
  fetchCustomers,
  updateCustomer,
} from "./api/customers";
import {
  createDevice,
  deleteDevice,
  fetchDevice,
  fetchDevices,
  updateDevice,
} from "./api/devices";
import {
  createPolicy,
  deletePolicy,
  fetchPolicies,
  fetchPolicy,
} from "./api/policies";
import {
  createThing,
  deleteThing,
  fetchThing,
  fetchThings,
  updateThing,
} from "./api/thing_registry";
import {
  createTransferProcess,
  fetchTransferProcess,
  fetchTransferProcesses,
} from "./api/transfer_processes";
import { fetchUsers, fetchUser } from "./api/users";

export default {
  getList: async (resource: any, params: any) => {
    if (resource === "thingDescriptions") {
      const result = await fetchThings(params.pagination, params.sort);
      return {
        data: result.things.map((thing: any) => ({
          ...thing,
          description: {},
        })),
        total: result.totalPages * result.pageSize,
      };
    } else if (resource === "assets") {
      const assets = await fetchAssets(params.pagination);
      return {
        data: assets.map((asset: any) => ({
          ...asset,
          id: asset["@id"],
        })),
        pageInfo: {
          hasNextPage: assets.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      };
    } else if (resource === "customers") {
      const customers = await fetchCustomers(params.pagination);
      return {
        data: customers,
        pageInfo: {
          hasNextPage: customers.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      };
    } else if (resource === "users") {
      const users = await fetchUsers(params.pagination);
      return {
        data: users,
        pageInfo: {
          hasNextPage: users.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      };
    } else if (resource === "policies") {
      const policies = await fetchPolicies(params.pagination);
      return {
        data: policies.map((policy: any) => ({
          ...policy,
          id: policy["@id"],
        })),
        pageInfo: {
          hasNextPage: policies.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      };
    } else if (resource === "contractdefinitions") {
      const contracts = await fetchContractDefinitions(params.pagination);
      return {
        data: contracts.map((contract: any) => ({
          ...contract,
          id: contract["@id"],
        })),
        pageInfo: {
          hasNextPage: contracts.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      };
    } else if (resource === "contractagreements") {
      const contracts = await fetchContractAgreements(params.pagination);
      return {
        data: contracts.map((contract: any) => ({
          contractAgreement: {
            ...contract,
            id: contract["@id"],
          },
          negotiation: {},
          dataset: {},
          id: contract["@id"],
        })),
        pageInfo: {
          hasNextPage: contracts.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      };
    } else if (resource === "transferprocesses") {
      const transferProccesses = await fetchTransferProcesses(
        params.pagination
      );
      return {
        data: transferProccesses.map((transferProcess: any) => ({
          ...transferProcess,
          id: transferProcess["@id"],
        })),
        pageInfo: {
          hasNextPage: transferProccesses.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      };
    } else if (resource === "devices") {
      const devices = await fetchDevices(params.pagination);
      return {
        data: devices.data.map((device: any) => ({
          ...device,
          id: device.id.id,
        })),
        total: devices.totalElements,
      };
    }
  },
  getOne: async (resource: any, params: any) => {
    if (resource === "thingDescriptions") {
      const description = await fetchThing(params.id);
      return {
        data: {
          id: description.id,
          description,
        },
      };
    } else if (resource === "assets") {
      const asset = await fetchAsset(params.id);
      return {
        data: {
          ...asset,
          id: asset["@id"],
        },
      };
    } else if (resource === "customers") {
      const customer = await fetchCustomer(params.id);
      return {
        data: customer,
      };
    } else if (resource === "users") {
      const user = await fetchUser(params.id);
      return {
        data: user,
      };
    } else if (resource === "policies") {
      const policy = await fetchPolicy(params.id);
      return {
        data: {
          ...policy,
          id: policy["@id"],
        },
      };
    } else if (resource === "contractdefinitions") {
      const contractDefinition = await fetchContractDefinition(params.id);
      return {
        data: {
          ...contractDefinition,
          id: contractDefinition["@id"],
        },
      };
    } else if (resource === "catalog") {
      const catalog = await fetchCatalog(params.id);
      return {
        data: {
          id: params.id,
          ...catalog,
        },
        id: params.id,
      };
    } else if (resource === "contractnegotiations") {
      const contractNegotiation = await fetchContractNegotiation(params.id);
      return {
        data: {
          ...contractNegotiation,
          id: contractNegotiation["@id"],
        },
      };
    } else if (resource === "contractagreements") {
      const contractAgreement = await fetchContractAgreement(params.id);
      const negotiation = await fetchContractAgreementNegotiation(
        contractAgreement["@id"]
      );
      const dataset = await fetchCatalogDataset(
        negotiation["counterPartyAddress"],
        contractAgreement.assetId
      );
      return {
        data: {
          contractAgreement,
          negotiation,
          dataset,
          id: contractAgreement["@id"],
        },
      };
    } else if (resource === "transferprocesses") {
      const transferProcess = await fetchTransferProcess(params.id);
      return {
        data: {
          ...transferProcess,
          id: transferProcess["@id"],
        },
      };
    } else if (resource === "devices") {
      const device = await fetchDevice(params.id);
      return {
        data: {
          ...device,
          id: device.id.id,
        },
      };
    }
  },
  update: async (resource: any, params: any) => {
    if (resource === "thingDescriptions") {
      const updatedThing = await updateThing(
        params.id,
        params.data.description
      );
      return {
        data: {
          id: updatedThing.id,
          description: updatedThing,
        },
      };
    } else if (resource === "customers") {
      const updatedCustomer = await updateCustomer(params.id, params.data);
      return {
        data: updatedCustomer,
      };
    } else if (resource === "devices") {
      const updatedDevice = await updateDevice(params.id, params.data);
      return {
        data: {
          ...updatedDevice,
          id: updatedDevice.id.id,
        },
      };
    }
  },
  create: async (resource: any, params: any) => {
    if (resource === "thingDescriptions") {
      const createdThing = await createThing(params.data.description);
      return {
        data: {
          id: createdThing.id,
          description: {},
        },
      };
    } else if (resource === "assets") {
      await createAsset({
        ...params.data,
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
      });

      return {
        data: {
          ...params.data,
          id: params.data["@id"],
        },
      };
    } else if (resource === "customers") {
      const customer = await createCustomer(params.data);
      return {
        data: customer,
      };
    } else if (resource === "policies") {
      const policy = await createPolicy({
        ...params.data,
        policy: {
          ...params.data.policy,
        },
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          odrl: "http://www.w3.org/ns/odrl/2/",
        },
      });
      return {
        data: {
          ...policy,
          id: policy["@id"],
        },
      };
    } else if (resource === "contractdefinitions") {
      const contractDefinition = await createContractDefinition({
        ...params.data,
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
      });
      return {
        data: {
          ...contractDefinition,
          id: contractDefinition["@id"],
        },
      };
    } else if (resource === "contractnegotiations") {
      const contractNegotation = await createContractNegotiation({
        ...params.data,
        "@type": "ContractRequest",
        policy: {
          ...params.data.policy,
          "@context": "http://www.w3.org/ns/odrl.jsonld",
        },
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
      });
      return {
        data: {
          ...contractNegotation,
          id: contractNegotation["@id"],
        },
      };
    } else if (resource === "transferprocesses") {
      const transferProcess = await createTransferProcess({
        ...params.data,
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
        "@type": "TransferRequestDto",
      });
      return {
        data: {
          ...transferProcess,
          id: transferProcess["@id"],
        },
      };
    } else if (resource === "devices") {
      const device = await createDevice(params.data);
      return {
        data: {
          ...device,
          id: device.id.id,
        },
      };
    }
  },
  delete: async (resource: any, params: any) => {
    if (resource === "thingDescriptions") {
      await deleteThing(params.id);
      return {
        data: {
          id: params.id,
        },
      };
    } else if (resource === "assets") {
      await deleteAsset(params.id);
      return {
        data: {
          id: params.id,
        },
      };
    } else if (resource === "customers") {
      await deleteCustomer(params.id);
      return {
        data: {
          id: params.id,
        },
      };
    } else if (resource === "policies") {
      await deletePolicy(params.id);
      return {
        data: {
          id: params.id,
        },
      };
    } else if (resource === "contractdefinitions") {
      await deleteContractDefinition(params.id);
      return {
        data: {
          id: params.id,
        },
      };
    } else if (resource === "devices") {
      await deleteDevice(params.id);
      return {
        data: {
          id: params.id,
        },
      };
    }
  },
};
