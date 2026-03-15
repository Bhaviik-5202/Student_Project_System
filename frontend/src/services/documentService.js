import api from "../utils/api";

const documentService = {
  getAll: async () => {
    return await api.get("/resources/documents");
  },
  // Add more methods as needed (upload, download, etc.)
};

export default documentService;
