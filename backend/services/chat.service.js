const chatRepository = require("../repositories/chat.repository");

function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const chat = await chatRepository.create(data);
    return response(false, chat, "Chat created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create chat");
  }
};

exports.getAll = async () => {
  try {
    const chats = await chatRepository.findAll();
    return response(false, chats, "Chats fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch chats");
  }
};

exports.getById = async (id) => {
  try {
    const chat = await chatRepository.findById(id);
    if (!chat) return response(true, null, "Chat not found");
    return response(false, chat, "Chat fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch chat");
  }
};

exports.update = async (id, data) => {
  try {
    const chat = await chatRepository.update(id, data);
    if (!chat) return response(true, null, "Chat not found");
    return response(false, chat, "Chat updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update chat");
  }
};

exports.remove = async (id) => {
  try {
    const chat = await chatRepository.remove(id);
    if (!chat) return response(true, null, "Chat not found");
    return response(false, null, "Chat deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete chat");
  }
};
