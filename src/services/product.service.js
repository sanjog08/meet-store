import api from './api';

/**
 * Products API calls.
 * GET endpoints are public; POST/PUT/DELETE require admin.
 */
const productService = {
  /** GET /products — optional filters: { category, brand, page, limit } */
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /** GET /products/:id */
  getOne: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  /** POST /products — Admin only */
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data.data;
  },

  /** PUT /products/:id — Admin only */
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  /** DELETE /products/:id — Admin only */
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
