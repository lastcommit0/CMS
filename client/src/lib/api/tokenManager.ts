const TOKEN_KEY = 'access_token';

let accessToken: string | null = sessionStorage.getItem(TOKEN_KEY);

export const accessTokenStore = {
  get: () => accessToken,

  set: (token: string | null) => {
    accessToken = token;

    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  },

  clear: () => {
    accessToken = null;
    sessionStorage.removeItem(TOKEN_KEY);
  },
};
