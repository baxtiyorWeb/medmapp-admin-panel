// utils/api.ts
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Auth tokenlarni olish
 */
export const getAuthTokens = () => {
  if (typeof window === "undefined") return { accessToken: null, refreshToken: null };

  return {
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  };
};

/**
 * Tokenlarni saqlash
 */
export const setAuthTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};

/**
 * Tokenlarni o‘chirish
 */
export const removeAuthTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

/**
 * Login sahifasiga yo‘naltirish
 */
const redirectToLogin = () => {
  removeAuthTokens();
  setTimeout(() => {
    // Operator va patient panel uchun alohida
    if (window.location.pathname.startsWith("/patients-panel")) {
      window.location.href = "/login";
    } else {
      window.location.href = "/operator/login";
    }
  }, 800);
};

/**
 * Request interceptor
 */
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

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken } = getAuthTokens();

      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        // Refresh token orqali yangi access token olish
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access;

        // Tokenlarni yangilash
        setAuthTokens(newAccessToken, refreshToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // Avvalgi so‘rovni qayta yuborish
        return api(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
