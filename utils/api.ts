// utils/api.ts

import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/"; // O'zingizning API URL'ingizni kiriting

// Axios instansiyasini yaratish
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tokenlarni local storage'dan olish
export const getAuthTokens = () => {
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const refreshToken =
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null;
  return { accessToken, refreshToken };
};

// Tokenlarni local storage'ga saqlash
export const setAuthTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};

// Tokenlarni o'chirish
export const removeAuthTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// So'rov yuborilishidan oldin token qo'shish (Request Interceptor)
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getAuthTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Javobni ushlash (Response Interceptor)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Agar xato 401 bo'lsa va bu birinchi urinish bo'lsa
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = getAuthTokens();
        if (!refreshToken) {
          removeAuthTokens();
          return Promise.reject(error);
        }

        // Tokenni yangilash
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;
        const newRefreshToken = refreshResponse.data.refresh;

        // Yangi tokenlarni saqlash
        setAuthTokens(newAccessToken, newRefreshToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Asl so'rovni qayta yuborish
        return api(originalRequest);
      } catch (refreshError) {
        // Token yangilashda ham xato bo'lsa, tizimdan chiqarish
        removeAuthTokens();
        window.location.reload(); // Yoki login sahifasiga yo'naltirish
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
