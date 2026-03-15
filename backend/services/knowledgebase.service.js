const knowledgebaseRepository = require("../repositories/knowledgebase.repository");

function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const kb = await knowledgebaseRepository.create(data);
    return response(false, kb, "Knowledgebase entry created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create kb entry");
  }
};

exports.getAll = async () => {
  try {
    const entries = await knowledgebaseRepository.findAll();
    return response(false, entries, "Knowledgebase entries fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch kb entries");
  }
};

exports.getById = async (id) => {
  try {
    const kb = await knowledgebaseRepository.findById(id);
    if (!kb) return response(true, null, "Knowledgebase entry not found");
    return response(false, kb, "Knowledgebase entry fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch kb entry");
  }
};

exports.update = async (id, data) => {
  try {
    const kb = await knowledgebaseRepository.update(id, data);
    if (!kb) return response(true, null, "Knowledgebase entry not found");
    return response(false, kb, "Knowledgebase entry updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update kb entry");
  }
};

exports.remove = async (id) => {
  try {
    const kb = await knowledgebaseRepository.remove(id);
    if (!kb) return response(true, null, "Knowledgebase entry not found");
    return response(false, null, "Knowledgebase entry deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete kb entry");
  }
};
