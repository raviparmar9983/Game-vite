import axios from "axios";
import Cookies from "js-cookie";
import { environment } from "./env";

const api = axios.create({
  baseURL: environment.API_URL,
  withCredentials: true,
});

// 🔥 Attach access token
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const message = new Error(
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );

    if (status === 401) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      // redirect login
      window.location.href = "/auth/login";
    }

    return Promise.reject(message);
  }
);

export { api };