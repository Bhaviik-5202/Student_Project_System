const studentRepository = require("../repositories/student.repository");
function response(error, data, message) {
  return { error, data, message };
}
exports.create = async (data) => {
  try {
    const student = await studentRepository.create(data);
    return response(false, student, "Student created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create student");
  }
};
exports.getAll = async () => {
  try {
    const students = await studentRepository.findAll();
    return response(false, students, "Students fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch students");
  }
};
exports.getById = async (id) => {
  try {
    const student = await studentRepository.findById(id);
    if (!student) return response(true, null, "Student not found");
    return response(false, student, "Student fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch student");
  }
};
exports.update = async (id, data) => {
  try {
    const student = await studentRepository.update(id, data);
    if (!student) return response(true, null, "Student not found");
    return response(false, student, "Student updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update student");
  }
};
exports.remove = async (id) => {
  try {
    const student = await studentRepository.remove(id);
    if (!student) return response(true, null, "Student not found");
    return response(false, null, "Student deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete student");
  }
};
