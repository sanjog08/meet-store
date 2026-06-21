import api from './api';

const aboutUsService = {
  /** GET /about-us — public */
  get: async () => {
    const response = await api.get('/about-us');
    return response.data.data;
  },

  /** POST /about-us — Admin only (first-time create) */
  create: async (data) => {
    const response = await api.post('/about-us', data);
    return response.data.data;
  },

  /** PUT /about-us — Admin only (partial update) */
  update: async (data) => {
    const response = await api.put('/about-us', data);
    return response.data.data;
  },
};

export default aboutUsService;
