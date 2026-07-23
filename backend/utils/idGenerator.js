/**
 * Unique ID Generator & Department Normalizer Utility
 * Generates unique Roll Numbers (STU2026XXXX) for students and Faculty IDs (FAC2026XXXX) for staff/faculty.
 */
const User = require('../models/user.model');
const Student = require('../models/student.model');
const Staff = require('../models/staff.model');
const logger = require('./logger');

const DEPARTMENT_MAP = {
  CE: 'Computer Engineering',
  CSE: 'Computer Science & Engineering',
  CS: 'Computer Science',
  IT: 'Information Technology',
  EC: 'Electronics & Communication',
  EE: 'Electrical Engineering',
  ME: 'Mechanical Engineering',
  CIVIL: 'Civil Engineering',
  AI: 'Artificial Intelligence & Data Science',
  AIDS: 'Artificial Intelligence & Data Science',
  TBA: 'Computer Engineering',
};

/**
 * Standardize department strings into full department names
 */
function normalizeDepartment(dept) {
  if (!dept || typeof dept !== 'string' || dept.trim() === '') {
    return 'Computer Engineering';
  }
  const trimmed = dept.trim();
  const upper = trimmed.toUpperCase();
  return DEPARTMENT_MAP[upper] || trimmed;
}

/**
 * Generate a unique Roll Number for Students
 * Format: STU20260001, STU20260002...
 */
async function generateRollNumber() {
  const year = new Date().getFullYear();
  const prefix = `STU${year}`;

  const studentCount = await User.countDocuments({
    role: 'student',
    rollNumber: new RegExp(`^${prefix}`),
  });

  let seq = studentCount + 1;
  let candidate = `${prefix}${String(seq).padStart(4, '0')}`;

  while (true) {
    const existingUser = await User.findOne({ rollNumber: candidate });
    const existingStudent = await Student.findOne({ rollNumber: candidate });

    if (!existingUser && !existingStudent) {
      break;
    }
    seq++;
    candidate = `${prefix}${String(seq).padStart(4, '0')}`;
  }

  return candidate;
}

/**
 * Generate a unique Faculty ID for Faculty/Staff
 * Format: FAC20260001, FAC20260002...
 */
async function generateFacultyId() {
  const year = new Date().getFullYear();
  const prefix = `FAC${year}`;

  const facultyCount = await User.countDocuments({
    role: { $in: ['faculty', 'admin'] },
    facultyId: new RegExp(`^${prefix}`),
  });

  let seq = facultyCount + 1;
  let candidate = `${prefix}${String(seq).padStart(4, '0')}`;

  while (true) {
    const existingUser = await User.findOne({ facultyId: candidate });
    const existingStaff = await Staff.findOne({ facultyId: candidate });

    if (!existingUser && !existingStaff) {
      break;
    }
    seq++;
    candidate = `${prefix}${String(seq).padStart(4, '0')}`;
  }

  return candidate;
}

/**
 * Backfill legacy database entries missing Roll Numbers or Faculty IDs
 */
async function backfillMissingIdentifiers() {
  try {
    // Backfill students missing rollNumber
    const studentsWithoutRoll = await User.find({
      role: 'student',
      $or: [
        { rollNumber: { $exists: false } },
        { rollNumber: null },
        { rollNumber: '' },
        { rollNumber: /^TEMP-/i },
      ],
    });

    for (const u of studentsWithoutRoll) {
      const rollNumber = await generateRollNumber();
      const enrollmentNumber = `EN${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;
      u.rollNumber = rollNumber;
      u.enrollmentNumber = u.enrollmentNumber || enrollmentNumber;
      u.department = normalizeDepartment(u.department);
      await u.save();

      // Sync with Student collection
      await Student.findOneAndUpdate(
        { email: u.email },
        {
          rollNumber,
          enrollmentNumber: u.enrollmentNumber,
          department: u.department,
          name: u.name,
          phone: u.phone,
          status: 'Active',
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    // Backfill faculty missing facultyId
    const facultyWithoutId = await User.find({
      role: { $in: ['faculty', 'admin'] },
      $or: [
        { facultyId: { $exists: false } },
        { facultyId: null },
        { facultyId: '' },
        { facultyId: /^TEMP-/i },
      ],
    });

    for (const u of facultyWithoutId) {
      const facultyId = await generateFacultyId();
      u.facultyId = facultyId;
      u.department = normalizeDepartment(u.department);
      await u.save();

      // Sync with Staff collection
      await Staff.findOneAndUpdate(
        { email: u.email },
        {
          facultyId,
          department: u.department,
          name: u.name,
          designation: u.designation || 'Assistant Professor',
          phone: u.phone,
          status: 'Active',
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
  } catch (error) {
    logger.error('Error during backfillMissingIdentifiers:', error);
  }
}

module.exports = {
  generateRollNumber,
  generateFacultyId,
  normalizeDepartment,
  backfillMissingIdentifiers,
};
