import axios from 'axios';
import { accessTokenStore } from './tokenManager';

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      console.log("Calling Refreshing access token...");
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
      console.log("Refresh response:", res);
      const newToken = res.data.data.accessToken;
      console.log("Access token refreshed:", newToken);
      accessTokenStore.set(newToken);
      return newToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};
