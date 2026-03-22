import api from '../utils/api';

// Fetch all templates
export default {
  async getTemplates() {
    return await api.get('/templates');
  },
};
