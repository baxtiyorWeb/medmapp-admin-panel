// utils/api.ts
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = getAuthTokens();
        if (!refreshToken) {
          removeAuthTokens();
          return Promise.reject(error);
        }

        // Faqat access token yangilanadi
        const refreshResponse = await axios.post(
          `${API_BASE_URL}auth/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;
        setAuthTokens(newAccessToken, refreshToken); // Refresh o‘zgarmaydi
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Asl so‘rovni qayta yuboramiz
        return api(originalRequest);
      } catch (refreshError) {
        removeAuthTokens();
        window.location.href = "/login"; // login sahifasiga yo‘naltirish
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
