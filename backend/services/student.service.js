/**
 * Student Service
 * Business logic layer for student-related operations.
 */
const studentRepository = require('../repositories/student.repository');
const projectRepository = require('../repositories/project.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Get student projects
 * @param {string} studentId - Student identifier
 * @returns {Promise<Object>} Formatted service response with owned projects list
 */
exports.getProjects = async (studentId) => {
  try {
    const projects = await projectRepository.findAll({ owner: studentId });
    return response(false, projects, 'Student projects fetched successfully');
  } catch (err) {
    return response(
      true,
      null,
      err.message || 'Failed to fetch student projects'
    );
  }
};

/**
 * Create student profile
 * @param {Object} data - Student attribute data
 * @returns {Promise<Object>} Formatted service response with newly created profile
 */
const userRepository = require('../repositories/user.repository');
const { generateRollNumber, normalizeDepartment } = require('../utils/idGenerator');

exports.create = async (data) => {
  try {
    const cleanDepartment = normalizeDepartment(data.department);
    const rollNumber = data.rollNumber || (await generateRollNumber());
    const enrollmentNumber = data.enrollmentNumber || `EN${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;

    const studentData = {
      ...data,
      rollNumber,
      enrollmentNumber,
      department: cleanDepartment,
      status: data.status || 'Active',
    };

    const student = await studentRepository.create(studentData);
    return response(false, student, 'Student created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create student');
  }
};

/**
 * Fetch all students
 * @returns {Promise<Object>} Formatted service response with global student list
 */
exports.getAll = async () => {
  try {
    const [studentUsers, legacyStudents] = await Promise.all([
      userRepository.findAll({ role: 'student' }, { select: '-password', lean: true }),
      studentRepository.findAll(),
    ]);

    const studentMap = new Map();

    (studentUsers || []).forEach((u) => {
      studentMap.set(u.email.toLowerCase(), {
        _id: u._id,
        id: u._id,
        name: u.name,
        email: u.email,
        rollNumber: u.rollNumber || `STU${new Date().getFullYear()}${u._id.toString().slice(-4).toUpperCase()}`,
        enrollmentNumber: u.enrollmentNumber || `EN${new Date().getFullYear()}${u._id.toString().slice(-6).toUpperCase()}`,
        department: normalizeDepartment(u.department),
        semester: u.semester || 'Sem 1',
        year: u.year || '1',
        phone: u.phone || '',
        status: u.status === 'inactive' ? 'Inactive' : 'Active',
        avatar: u.avatar || null,
        registrationDate: u.createdAt || new Date(),
      });
    });

    (legacyStudents || []).forEach((s) => {
      const email = s.email?.toLowerCase();
      if (email && studentMap.has(email)) {
        const existing = studentMap.get(email);
        studentMap.set(email, {
          ...existing,
          rollNumber: s.rollNumber || existing.rollNumber,
          enrollmentNumber: s.enrollmentNumber || existing.enrollmentNumber,
          department: normalizeDepartment(s.department || existing.department),
          semester: s.semester || existing.semester,
          year: s.year || existing.year,
          phone: s.phone || existing.phone,
          status: s.status || existing.status,
          avatar: s.avatar || existing.avatar,
        });
      } else if (email) {
        studentMap.set(email, {
          _id: s._id,
          id: s._id,
          name: s.name,
          email: s.email,
          rollNumber: s.rollNumber || `STU${new Date().getFullYear()}${s._id.toString().slice(-4).toUpperCase()}`,
          enrollmentNumber: s.enrollmentNumber || `EN${new Date().getFullYear()}${s._id.toString().slice(-6).toUpperCase()}`,
          department: normalizeDepartment(s.department),
          semester: s.semester || 'Sem 1',
          year: s.year || '1',
          phone: s.phone || '',
          status: s.status || 'Active',
          avatar: s.avatar || null,
          registrationDate: s.createdAt || new Date(),
        });
      }
    });

    const studentList = Array.from(studentMap.values());
    return response(false, studentList, 'Students fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch students');
  }
};

/**
 * Get detailed student profile by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Formatted service response with student data
 */
exports.getById = async (id) => {
  try {
    const student = await studentRepository.findById(id);
    if (!student) return response(true, null, 'Student not found');
    return response(false, student, 'Student fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch student');
  }
};

/**
 * Update student profile attributes
 * @param {string} id - Student ID
 * @param {Object} data - Updated attributes
 * @returns {Promise<Object>} Formatted service response with updated student
 */
exports.update = async (id, data) => {
  try {
    const student = await studentRepository.update(id, data);
    if (!student) return response(true, null, 'Student not found');
    return response(false, student, 'Student updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update student');
  }
};

/**
 * Remove student profile
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Formatted service response with deletion status
 */
exports.remove = async (id) => {
  try {
    const student = await studentRepository.remove(id);
    if (!student) return response(true, null, 'Student not found');
    return response(false, null, 'Student deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete student');
  }
};
