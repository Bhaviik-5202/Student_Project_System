import api from "../utils/api";

// Fetch all templates
export default {
  async getTemplates() {
    const response = await api.get("/templates");
    return response.data;
  },
};
