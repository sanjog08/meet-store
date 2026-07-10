import api from './api';

const aboutUsService = {
  /** GET /about-us?lang=hi|en — public */
  get: async (lang = 'en') => {
    const response = await api.get('/about-us', { params: { lang } });
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
