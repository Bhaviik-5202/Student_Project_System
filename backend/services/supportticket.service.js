const supportticketRepository = require("../repositories/supportticket.repository");

function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const ticket = await supportticketRepository.create(data);
    return response(false, ticket, "Support ticket created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create support ticket");
  }
};

exports.getAll = async () => {
  try {
    const tickets = await supportticketRepository.findAll();
    return response(false, tickets, "Support tickets fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch support tickets");
  }
};

exports.getById = async (id) => {
  try {
    const ticket = await supportticketRepository.findById(id);
    if (!ticket) return response(true, null, "Support ticket not found");
    return response(false, ticket, "Support ticket fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch support ticket");
  }
};

exports.update = async (id, data) => {
  try {
    const ticket = await supportticketRepository.update(id, data);
    if (!ticket) return response(true, null, "Support ticket not found");
    return response(false, ticket, "Support ticket updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update support ticket");
  }
};

exports.remove = async (id) => {
  try {
    const ticket = await supportticketRepository.remove(id);
    if (!ticket) return response(true, null, "Support ticket not found");
    return response(false, null, "Support ticket deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete support ticket");
  }
};
