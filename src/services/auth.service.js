import api from './api';

/**
 * Auth API calls.
 * Tokens are returned in the response body and stored in Zustand / localStorage.
 */
const authService = {
  /**
   * POST /auth/signup
   * @param {{ name: string, username: string, email: string, password: string }} data
   * @returns {{ accessToken, refreshToken, user }}
   */
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data.data;
  },

  /**
   * POST /auth/login
   * Accepts email OR username
   * @param {{ identifier: string, password: string }} data
   * @returns {{ accessToken, refreshToken, user }}
   */
  login: async ({ identifier, password }) => {
    // The backend accepts either { email } or { username }
    const isEmail = identifier.includes('@');
    const payload = isEmail
      ? { email: identifier, password }
      : { username: identifier, password };

    const response = await api.post('/auth/login', payload);
    return response.data.data;
  },

  /**
   * POST /auth/logout
   * @param {string} refreshToken
   */
  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', { refreshToken });
    return response.data;
  },
};

export default authService;
