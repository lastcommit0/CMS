import axios from 'axios';
import { accessTokenStore } from './tokenManager';

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await axios.post('/auth/refresh', {}, { withCredentials: true });

      const newToken = res.data.accessToken;
      accessTokenStore.set(newToken);
      return newToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};
