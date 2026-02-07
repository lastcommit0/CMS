import axios from 'axios';

let refreshPromise: Promise<void> | null = null;

export const refreshAccessToken = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};
