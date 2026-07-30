/**
 * Student Service
 * Business logic layer for student-related operations.
 */
const studentRepository = require('../repositories/student.repository');
const projectRepository = require('../repositories/project.repository');
const userRepository = require('../repositories/user.repository');
const { normalizeDepartment } = require('../utils/idGenerator');

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
 * Fetch all students
 * @returns {Promise<Object>} Formatted service response with global student list
 */
exports.getAll = async (currentUser = null) => {
  try {
    let allowedStudentIds = null;
    if (currentUser && currentUser.role === 'faculty') {
      const facultyId = currentUser._id || currentUser.id;
      const facultyProjects = await projectRepository.findAll({
        $or: [{ guide: facultyId }, { coGuide: facultyId }],
      });
      allowedStudentIds = new Set();
      (facultyProjects || []).forEach((p) => {
        if (p.leader) {
          allowedStudentIds.add((p.leader._id || p.leader).toString());
          if (p.leader.email) allowedStudentIds.add(p.leader.email.toLowerCase());
        }
        (p.members || []).forEach((m) => {
          allowedStudentIds.add((m._id || m).toString());
          if (m.email) allowedStudentIds.add(m.email.toLowerCase());
        });
      });
    }

    const [studentUsers, legacyStudents] = await Promise.all([
      userRepository.findAll(
        { role: 'student' },
        { select: '-password', lean: true }
      ),
      studentRepository.findAll(),
    ]);

    const studentMap = new Map();

    (studentUsers || []).forEach((u) => {
      studentMap.set(u.email.toLowerCase(), {
        _id: u._id,
        id: u._id,
        name: u.name,
        email: u.email,
        rollNumber:
          u.rollNumber ||
          `STU${new Date().getFullYear()}${u._id.toString().slice(-4).toUpperCase()}`,
        enrollmentNumber:
          u.enrollmentNumber ||
          `EN${new Date().getFullYear()}${u._id.toString().slice(-6).toUpperCase()}`,
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
      } else if (s._id) {
        studentMap.set(s._id.toString(), {
          _id: s._id,
          id: s._id,
          name: s.name,
          email: s.email || '',
          rollNumber: s.rollNumber || '',
          enrollmentNumber: s.enrollmentNumber || '',
          department: normalizeDepartment(s.department),
          semester: s.semester || 'Sem 1',
          year: s.year || '1',
          phone: s.phone || '',
          status: s.status || 'Active',
          registrationDate: s.createdAt || new Date(),
        });
      }
    });

    let resultList = Array.from(studentMap.values());
    if (allowedStudentIds) {
      resultList = resultList.filter((s) =>
        allowedStudentIds.has((s._id || s.id).toString()) ||
        (s.email && allowedStudentIds.has(s.email.toLowerCase()))
      );
    }

    return response(false, resultList, 'Students fetched successfully');
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
    let student = await studentRepository.findById(id);
    if (!student) {
      const user = await userRepository.findById(id, {
        select: '-password',
        lean: true,
      });
      if (user && (user.role === 'student' || !user.role)) {
        const existingStudent = await studentRepository.findByEmail(user.email);
        if (existingStudent) {
          student = existingStudent;
        } else {
          student = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            rollNumber:
              user.rollNumber ||
              `STU${new Date().getFullYear()}${user._id.toString().slice(-4).toUpperCase()}`,
            enrollmentNumber:
              user.enrollmentNumber ||
              `EN${new Date().getFullYear()}${user._id.toString().slice(-6).toUpperCase()}`,
            department: normalizeDepartment(user.department),
            semester: user.semester || 'Sem 1',
            year: user.year || 1,
            phone: user.phone || '',
            status: user.status === 'inactive' ? 'Inactive' : 'Active',
            avatar: user.avatar || null,
          };
        }
      }
    }
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
    const cleanDepartment = data.department
      ? normalizeDepartment(data.department)
      : undefined;
    const updateData = { ...data };
    if (cleanDepartment) updateData.department = cleanDepartment;

    let student = await studentRepository.update(id, updateData);
    let user = null;

    if (student) {
      user = await userRepository.findByEmail(student.email);
      if (user) {
        await userRepository.update(user._id, {
          name: data.name || user.name,
          department: cleanDepartment || user.department,
          year: data.year ? String(data.year) : user.year,
          phone: data.phone !== undefined ? data.phone : user.phone,
          status: data.status ? data.status.toLowerCase() : user.status,
          rollNumber: data.rollNumber || user.rollNumber,
        });
      }
    } else {
      user = await userRepository.findById(id);
      if (user) {
        user = await userRepository.update(id, {
          name: data.name || user.name,
          department: cleanDepartment || user.department,
          year: data.year ? String(data.year) : user.year,
          phone: data.phone !== undefined ? data.phone : user.phone,
          status: data.status ? data.status.toLowerCase() : user.status,
          rollNumber: data.rollNumber || user.rollNumber,
        });
        let studentRecord = await studentRepository.findByEmail(user.email);
        if (studentRecord) {
          student = await studentRepository.update(
            studentRecord._id,
            updateData
          );
        } else {
          student = await studentRepository.create({
            name: user.name,
            email: user.email,
            rollNumber:
              data.rollNumber ||
              user.rollNumber ||
              `STU${new Date().getFullYear()}${user._id.toString().slice(-4).toUpperCase()}`,
            department: cleanDepartment || user.department,
            year: Number(data.year) || 1,
            phone: data.phone || '',
            status: 'Active',
          });
        }
      }
    }

    if (!student && !user) return response(true, null, 'Student not found');
    return response(false, student || user, 'Student updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update student');
  }
};

/**
 * Create a new student record
 * @param {Object} data - Student details
 * @returns {Promise<Object>} Formatted service response with created student
 */
exports.create = async (data) => {
  try {
    const cleanDepartment = data.department
      ? normalizeDepartment(data.department)
      : 'Computer Engineering';

    let user = await userRepository.findByEmail(data.email);
    if (!user) {
      user = await userRepository.create({
        name: data.name,
        email: data.email,
        password: data.password || 'Student@123',
        role: 'student',
        department: cleanDepartment,
        phone: data.phone || '',
        year: data.year ? String(data.year) : '1',
        rollNumber: data.rollNumber || '',
        enrollmentNumber: data.enrollmentNumber || '',
        status: 'active',
      });
    }

    let student = await studentRepository.findByEmail(data.email);
    if (!student) {
      student = await studentRepository.create({
        name: data.name,
        email: data.email,
        rollNumber:
          data.rollNumber ||
          user.rollNumber ||
          `STU${new Date().getFullYear()}${user._id.toString().slice(-4).toUpperCase()}`,
        enrollmentNumber:
          data.enrollmentNumber ||
          user.enrollmentNumber ||
          `EN${new Date().getFullYear()}${user._id.toString().slice(-6).toUpperCase()}`,
        department: cleanDepartment,
        year: Number(data.year) || 1,
        semester: data.semester || 'Sem 1',
        phone: data.phone || '',
        status: 'Active',
      });
    }

    return response(false, student || user, 'Student created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create student');
  }
};

/**
 * Remove student profile
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Formatted service response with deletion status
 */
exports.remove = async (id) => {

  try {
    let deletedStudent = null;
    let deletedUser = null;

    deletedStudent = await studentRepository.remove(id);

    if (deletedStudent && deletedStudent.email) {
      const user = await userRepository.findByEmail(deletedStudent.email);
      if (user) {
        deletedUser = await userRepository.remove(user._id);
      }
    } else {
      const user = await userRepository.findById(id);
      if (user) {
        deletedUser = await userRepository.remove(id);
        const studentRecord = await studentRepository.findByEmail(user.email);
        if (studentRecord) {
          deletedStudent = await studentRepository.remove(studentRecord._id);
        }
      }
    }

    if (!deletedStudent && !deletedUser) {
      return response(true, null, 'Student not found');
    }

    return response(false, null, 'Student deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete student');
  }
};
