import api from './api';

const adminRequestService = {
  /** POST /admin-requests — Customer: apply to become admin */
  apply: async () => {
    const response = await api.post('/admin-requests');
    return response.data.data;
  },

  /** GET /admin-requests — Admin: list all, optional { status } filter */
  getAll: async (params = {}) => {
    const response = await api.get('/admin-requests', { params });
    return response.data;
  },

  /** PUT /admin-requests/:id — Admin: approve or reject */
  review: async (id, action) => {
    const response = await api.put(`/admin-requests/${id}`, { action });
    return response.data.data;
  },

  /** DELETE /admin-requests/:id — Customer: withdraw pending request */
  withdraw: async (id) => {
    const response = await api.delete(`/admin-requests/${id}`);
    return response.data;
  },
};

export default adminRequestService;
