import api from './api';

const newProductsService = {
  /** GET /new-products — public */
  getAll: async () => {
    const response = await api.get('/new-products');
    return response.data;
  },
};

export default newProductsService;
