const Project = require("../models/Project");
// Add a project for a student
exports.addProject = async (studentId, projectData) => {
  const student = await Student.findById(studentId);
  if (!student) return null;
  const project = await Project.create({
    ...projectData,
    members: [studentId],
  });
  student.projects.push(project._id);
  await student.save();
  return project;
};

const Student = require("../models/Student");

exports.findAll = async (filter = {}) => {
  return Student.find(filter).populate("projects");
};

exports.findById = async (id) => {
  return Student.findById(id).populate("projects");
};

exports.create = async (data) => {
  const student = new Student(data);
  return student.save();
};

exports.update = async (id, data) => {
  return Student.findByIdAndUpdate(id, data, { new: true });
};

exports.remove = async (id) => {
  return Student.findByIdAndDelete(id);
};

exports.getProjects = async (id) => {
  const student = await Student.findById(id).populate("projects");
  return student ? student.projects : null;
};

exports.getGrades = async (id) => {
  const student = await Student.findById(id).populate("grades.project");
  return student ? student.grades : null;
};

exports.addGrade = async (studentId, projectId, grade) => {
  const student = await Student.findById(studentId);
  if (!student) return null;
  student.grades.push({ project: projectId, grade });
  await student.save();
  return student;
};

exports.removeGrade = async (studentId, projectId) => {
  const student = await Student.findById(studentId);
  if (!student) return null;
  student.grades = student.grades.filter(
    (g) => g.project.toString() !== projectId,
  );
  await student.save();
  return student;
};

exports.getGradeForProject = async (studentId, projectId) => {
  const student = await Student.findById(studentId).populate("grades.project");
  if (!student) return null;
  const gradeEntry = student.grades.find(
    (g) => g.project._id.toString() === projectId,
  );
  return gradeEntry ? gradeEntry.grade : null;
};

exports.getProjectGrade = async (studentId, projectId) => {
  const student = await Student.findById(studentId).populate("grades.project");
  if (!student) return null;
  const gradeEntry = student.grades.find(
    (g) => g.project._id.toString() === projectId,
  );
  return gradeEntry ? gradeEntry.grade : null;
};

exports.getProjectGrades = async (studentId) => {
  const student = await Student.findById(studentId).populate("grades.project");
  if (!student) return null;
  return student.grades.map((g) => ({
    project: g.project,
    grade: g.grade,
  }));
};

exports.getAverageGrade = async (studentId) => {
  const student = await Student.findById(studentId).populate("grades.project");
  if (!student) return null;
  const totalGrades = student.grades.reduce((sum, g) => sum + g.grade, 0);
  return student.grades.length > 0 ? totalGrades / student.grades.length : null;
};

exports.getCourses = async (id) => {
  const student = await Student.findById(id).populate("courses");
  return student ? student.courses : null;
};

exports.enrollInCourse = async (studentId, courseId) => {
  const student = await Student.findById(studentId);
  if (!student) return null;
  if (!student.courses.includes(courseId)) {
    student.courses.push(courseId);
    await student.save();
  }
  return student;
};

exports.leaveCourse = async (studentId, courseId) => {
  const student = await Student.findById(studentId);
  if (!student) return null;
  student.courses.pull(courseId);
  await student.save();
  return student;
};
