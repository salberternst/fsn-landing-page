import {
  createAsset,
  deleteAsset,
  fetchAsset,
  fetchAssets,
} from "./api/assets";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomer,
  fetchCustomers,
  updateCustomer,
} from "./api/customers";
import { createPolicy, deletePolicy, fetchPolicies, fetchPolicy } from "./api/policies";
import {
  createThing,
  deleteThing,
  fetchThing,
  fetchThings,
  updateThing,
} from "./api/thing_registry";
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
        data: customers.map((customer: any) => ({
          ...customer,
          thingsboard: {},
          fuseki: {},
        })),
        pageInfo: {
          hasNextPage: customers.length === params.pagination.perPage,
          hasPreviousPage: params.pagination.page > 1,
        },
      }
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
        "policy": {
          ...params.data.policy
        },
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          "odrl": "http://www.w3.org/ns/odrl/2/"
        },
      });
      return {
        data: {
          ...policy,
          id: policy["@id"]
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
    }
  },
};
