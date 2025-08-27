// utils/api.ts
import axios, { AxiosInstance } from "axios";
import Router from "next/router";
const API_BASE_URL = "https://medmapp.onrender.com/api/";
// https://medmapp.onrender.com/api/
// http://127.0.0.1:8000/api/
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getAuthTokens = () => {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const refreshToken =
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null;
  return { accessToken, refreshToken };
};

export const setAuthTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};

export const removeAuthTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

api.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check for a 401 error and make sure it's not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = getAuthTokens();
        // If no refresh token exists, the user is not authenticated.
        if (!refreshToken) {
          removeAuthTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${API_BASE_URL}auth/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;
        setAuthTokens(newAccessToken, refreshToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        removeAuthTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    } else {
      removeAuthTokens();
      Router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default api;
