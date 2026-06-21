import api from './api';

const todaysOfferService = {
  /** GET /todays-offer — public */
  getAll: async () => {
    const response = await api.get('/todays-offer');
    return response.data;
  },
};

export default todaysOfferService;
