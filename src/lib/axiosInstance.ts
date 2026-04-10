import axios from "axios";
import { clearBackendSession, getBackendAccessToken } from "./authSession";
import { environment } from "./env";

const api = axios.create({
  baseURL: environment.API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getBackendAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const message = new Error(
      error.response?.data?.message || error.message || "Something went wrong",
    );

    if (status === 401) {
      clearBackendSession();
    }

    return Promise.reject(message);
  },
);

export { api };
