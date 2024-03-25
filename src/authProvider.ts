import { AuthProvider, HttpError, fetchUtils } from "react-admin";
import data from "./users.json";

export const endpointBaseUrl = "http://35.88.138.136";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */
export const devAuthProvider: AuthProvider = {
  login: ({ username, password }) => {
    const user = data.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // eslint-disable-next-line no-unused-vars
      let { password, ...userToPersist } = user;
      localStorage.setItem("user", JSON.stringify(userToPersist));
      return Promise.resolve();
    }

    return Promise.reject(
      new HttpError("Unauthorized", 401, {
        message: "Invalid username or password",
      })
    );
  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    return Promise.resolve(undefined);
  },
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

// TODO: Add the real authProvider here
export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${endpointBaseUrl}/api/token`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const response = await fetch(request);
    if (response.ok) {
      const responseJSON = await response.json();
      localStorage.setItem("access", responseJSON.access);
      localStorage.setItem("refresh", responseJSON.refresh);

      return;
    }
    if (response.headers.get("content-type") !== "application/json") {
      throw new Error(response.statusText);
    }

    const json = await response.json();
    const error = json.non_field_errors;
    throw new Error(error || response.statusText);
  },
  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("access") ? Promise.resolve() : Promise.reject(),
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    return Promise.resolve();
  },
  getIdentity: async () => {
    const persistedUser = localStorage.getItem("user");
    if(persistedUser) {
      return Promise.resolve(JSON.parse(persistedUser));
    }
    const getUserInfoResponse = await fetchJsonWithAuthJWTToken(
      `${endpointBaseUrl}/api/user/me`,
      {
        method: "GET",
      }
    );

    if(getUserInfoResponse.status === 200) {
      const userResponseJson = getUserInfoResponse.json;
      localStorage.setItem("user", JSON.stringify(userResponseJson));
      return Promise.resolve(JSON.parse(userResponseJson));
    }

    return Promise.resolve(null);
  },
} as AuthProvider;

export function createOptionsFromJWTToken() {
  const token = localStorage.getItem('access');
  if (!token) {
    return {};
  }
  return {
    user: {
      authenticated: true,
      token: 'Bearer ' + token,
    },
  };
}

export function fetchJsonWithAuthJWTToken(url: string, options: object) {
  return fetchUtils.fetchJson(
    url,
    Object.assign(createOptionsFromJWTToken(), options)
  );
}