import api from './api';

const userAddressService = {
  /** GET /user-address/:userId */
  getAddress: async (userId) => {
    const response = await api.get(`/user-address/${userId}`);
    return response.data.data;
  },

  /** POST /user-address/:userId */
  createAddress: async (userId, data) => {
    const response = await api.post(`/user-address/${userId}`, data);
    return response.data.data;
  },

  /** PUT /user-address/:userId */
  updateAddress: async (userId, data) => {
    const response = await api.put(`/user-address/${userId}`, data);
    return response.data.data;
  },
};

export default userAddressService;
