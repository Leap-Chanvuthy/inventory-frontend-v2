import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/auth-slice";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_401_KEYWORDS = [
  "unauthenticated",
  "user must be authenticated",
  "invalid token",
  "token expired",
  "expired token",
  "bearer",
  "not authenticated",
];

const BUSINESS_401_KEYWORDS = [
  "cannot update used stock movement",
  "cannot delete used stock movement",
  "cannot update finalized reorder",
  "insufficient stock",
];

const shouldAutoLogoutOn401 = (error: any): boolean => {
  if (error?.response?.status !== 401) return false;

  // If we don't even have a token, avoid noisy global logout handling.
  const token = store.getState().auth.token;
  if (!token) return false;

  const data = error?.response?.data;
  const messageText = String(data?.message ?? "").toLowerCase();
  const detailText = String(data?.data ?? "").toLowerCase();
  const errorText = String(data?.error ?? "").toLowerCase();
  const wwwAuth = String(error?.response?.headers?.["www-authenticate"] ?? "").toLowerCase();
  const combined = `${messageText} ${detailText} ${errorText} ${wwwAuth}`;

  if (BUSINESS_401_KEYWORDS.some((k) => combined.includes(k))) {
    return false;
  }

  return AUTH_401_KEYWORDS.some((k) => combined.includes(k));
};

// Handle only authentication-related 401 automatically
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (shouldAutoLogoutOn401(error)) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);
