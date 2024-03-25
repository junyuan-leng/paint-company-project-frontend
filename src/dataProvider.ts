import simpleRestProvider from "ra-data-simple-rest";
import fakeRestDataProvider from "ra-data-fakerest";
import { DataProvider, fetchUtils } from "react-admin";
import data from "./data";
import { Paint, Status } from "./components";
import { endpointBaseUrl, fetchJsonWithAuthJWTToken } from "./authProvider";

const devBaseDataProvider = fakeRestDataProvider(data, true);

// TODO: Add url here when backend is ready
const baseDataProvider = simpleRestProvider(`${endpointBaseUrl}/api`);

// export const baseDataProvider = simpleRestProvider(
//   import.meta.env.VITE_SIMPLE_REST_URL
// );

export interface MyDataProvider extends DataProvider {
  updatePaintInventory: (
    source: Paint,
    destination: {
      inventory: number;
      id: string;
    }
  ) => Promise<void>;
  updatePaintStatus: (
    source: Paint,
    destination: {
      status: Status;
      id: string;
    }
  ) => Promise<void>;
}

// export const devDataProvider: MyDataProvider = {
//   ...devBaseDataProvider,
//   updatePaintStatus: async (source, destination) => {
//     await devDataProvider.update("paints", {
//       id: source.id,
//       data: {
//         status: destination.status,
//       },
//       previousData: {
//         status: source.status,
//       },
//     });
//   },
//   updatePaintInventory: async (source, destination) => {
//     await devDataProvider.update("paints", {
//       id: source.id,
//       data: {
//         inventory: destination.inventory,
//       },
//       previousData: {
//         inventory: source.inventory,
//       },
//     });
//   },
// };

const httpClient = fetchJsonWithAuthJWTToken;

export const dataProvider: MyDataProvider = {
  ...baseDataProvider,
  getOne: async (resource, params) => {
    const { json } = await httpClient(
      `${endpointBaseUrl}/api/${resource}/${params.id}`,
      {
        method: "GET",
      }
    );
    return {
      data: json,
    };
  },
  getList: async (resource) => {
    const { json } = await httpClient(`${endpointBaseUrl}/api/${resource}`, {
      method: "GET",
    });
    return {
      data: json.data,
      total: json.total
    };
  },
  updatePaintStatus: async (source, destination) => {
    await httpClient(`${endpointBaseUrl}/api/paints/${source.id}/status`, {
      method: "PUT",
      body: JSON.stringify({
        status: destination.status,
      }),
    });
  },
  updatePaintInventory: async (source, destination) => {
    await httpClient(`${endpointBaseUrl}/api/paints/${source.id}/inventory`, {
      method: "PUT",
      body: JSON.stringify({
        inventory: destination.inventory,
      }),
    });
  },
};
