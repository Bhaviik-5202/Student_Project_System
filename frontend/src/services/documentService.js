import api from "../utils/api";

const documentService = {
  getAll: async () => {
    const response = await api.get("/resources/documents");
    return response.data;
  },
  // Add more methods as needed (upload, download, etc.)
};

export default documentService;
