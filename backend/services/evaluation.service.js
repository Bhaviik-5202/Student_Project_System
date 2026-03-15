const evaluationRepository = require("../repositories/evaluation.repository");

function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const evaluation = await evaluationRepository.create(data);
    return response(false, evaluation, "Evaluation created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create evaluation");
  }
};

exports.getAll = async () => {
  try {
    const evaluations = await evaluationRepository.findAll();
    return response(false, evaluations, "Evaluations fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch evaluations");
  }
};

exports.getById = async (id) => {
  try {
    const evaluation = await evaluationRepository.findById(id);
    if (!evaluation) return response(true, null, "Evaluation not found");
    return response(false, evaluation, "Evaluation fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch evaluation");
  }
};

exports.update = async (id, data) => {
  try {
    const evaluation = await evaluationRepository.update(id, data);
    if (!evaluation) return response(true, null, "Evaluation not found");
    return response(false, evaluation, "Evaluation updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update evaluation");
  }
};

exports.remove = async (id) => {
  try {
    const evaluation = await evaluationRepository.remove(id);
    if (!evaluation) return response(true, null, "Evaluation not found");
    return response(false, evaluation, "Evaluation deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete evaluation");
  }
};
