import api from "../utils/api";

const chatService = {
  // --- Chats ---
  getUserChats: async () => {
    try {
      const response = await api.get("/chats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getChatById: async (id) => {
    try {
      const response = await api.get(`/chats/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createChat: async (data) => {
    try {
      const response = await api.post("/chats", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // --- Messages ---
  getMessages: async (chatId) => {
    try {
      const response = await api.get(`/messages/${chatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  sendMessage: async (chatId, content) => {
    try {
      const response = await api.post("/messages", { chatId, content });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (messageId) => {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default chatService;
