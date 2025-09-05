// utils/api.ts
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "https://medmapp-production.up.railway.app/api/";

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

    // Faqat 401 (Unauthorized) da ishlash kerak
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    
      try {
        const { refreshToken } = getAuthTokens();

       
        if (!refreshToken) {
          removeAuthTokens();
          setTimeout(() => {
            window.location.href = "/login";
          }, 300);
          return Promise.reject(error);
        }

        // token yangilashga urinish
        const refreshResponse = await axios.post(
          `${API_BASE_URL}auth/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = refreshResponse.data.access;
        setAuthTokens(newAccessToken, refreshToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // Avvalgi so'rovni qayta yuborish
        return api(originalRequest);
      } catch (refreshError) {
        // refresh ham ishlamadi → login sahifaga
        removeAuthTokens();
        setTimeout(() => {
          window.location.href = "/login";
        }, 300);
        return Promise.reject(refreshError);
      }
    }

    // Boshqa status kodlar → tokenlarni o‘chirib yubormaslik kerak
    return Promise.reject(error);
  }
);

export default api;
