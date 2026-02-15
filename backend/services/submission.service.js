const submissionRepository = require("../repositories/submission.repository");
function response(error, data, message) {
  return { error, data, message };
}
exports.create = async (data) => {
  try {
    const submission = await submissionRepository.create(data);
    return response(false, submission, "Submission created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create submission");
  }
};
exports.getAll = async () => {
  try {
    const submissions = await submissionRepository.findAll();
    return response(false, submissions, "Submissions fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch submissions");
  }
};
exports.getById = async (id) => {
  try {
    const submission = await submissionRepository.findById(id);
    if (!submission) return response(true, null, "Submission not found");
    return response(false, submission, "Submission fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch submission");
  }
};
exports.update = async (id, data) => {
  try {
    const submission = await submissionRepository.update(id, data);
    if (!submission) return response(true, null, "Submission not found");
    return response(false, submission, "Submission updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update submission");
  }
};
exports.remove = async (id) => {
  try {
    const submission = await submissionRepository.remove(id);
    if (!submission) return response(true, null, "Submission not found");
    return response(false, null, "Submission deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete submission");
  }
};
