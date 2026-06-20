import api from './api';

const userService = {
  /** GET /users — Admin only, optional filter: { role } */
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  /** GET /users/:id — Admin or own user */
  getOne: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  /** POST /users — Admin only */
  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data.data;
  },

  /** PUT /users/:id — Admin or own user */
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  /** PUT /users/:id/make-admin — Admin only */
  makeAdmin: async (id) => {
    const response = await api.put(`/users/${id}/make-admin`);
    return response.data.data;
  },

  /** DELETE /users/:id — Admin only */
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
