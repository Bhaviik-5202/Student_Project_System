/**
 * Staff Service
 * Business logic layer for staff-related operations.
 */
const staffRepository = require('../repositories/staff.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Onboard staff member
 * @param {Object} data - Staff profile data
 * @returns {Promise<Object>} Formatted service response with onboarded staff data
 */
const userRepository = require('../repositories/user.repository');
const { generateFacultyId, normalizeDepartment } = require('../utils/idGenerator');

exports.create = async (data) => {
  try {
    const cleanDepartment = normalizeDepartment(data.department);
    const facultyId = data.facultyId || (await generateFacultyId());

    const staffData = {
      ...data,
      facultyId,
      department: cleanDepartment,
      designation: data.designation || 'Assistant Professor',
      status: data.status || 'Active',
      joiningDate: data.joiningDate || new Date(),
    };

    const staff = await staffRepository.create(staffData);
    return response(false, staff, 'Staff member created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create staff');
  }
};

/**
 * Fetch all registered faculty staff members
 * @returns {Promise<Object>} Formatted service response with staff list
 */
exports.getAll = async () => {
  try {
    const [facultyUsers, legacyStaff] = await Promise.all([
      userRepository.findAll({ role: { $in: ['faculty', 'admin'] } }, { select: '-password', lean: true }),
      staffRepository.findAll(),
    ]);

    const staffMap = new Map();

    (facultyUsers || []).forEach((u) => {
      const facId = u.facultyId || u.staffId || `FAC${new Date().getFullYear()}${u._id.toString().slice(-4).toUpperCase()}`;
      staffMap.set(u.email.toLowerCase(), {
        _id: u._id,
        id: u._id,
        dbId: u._id,
        facultyId: facId,
        staffId: facId,
        name: u.name,
        email: u.email,
        role: u.role === 'admin' ? 'Administrator' : 'Faculty',
        designation: u.designation || (u.role === 'admin' ? 'Head of Department' : 'Assistant Professor'),
        department: normalizeDepartment(u.department),
        phone: u.phone || '',
        status: u.status === 'inactive' ? 'Inactive' : 'Active',
        joiningDate: u.joiningDate || u.createdAt || new Date(),
        avatar: u.avatar || null,
      });
    });

    (legacyStaff || []).forEach((s) => {
      const email = s.email?.toLowerCase();
      const facId = s.facultyId || s.staffId || `FAC${new Date().getFullYear()}${s._id.toString().slice(-4).toUpperCase()}`;
      if (email && staffMap.has(email)) {
        const existing = staffMap.get(email);
        staffMap.set(email, {
          ...existing,
          facultyId: s.facultyId || existing.facultyId,
          staffId: s.facultyId || existing.staffId,
          department: normalizeDepartment(s.department || existing.department),
          designation: s.designation || existing.designation,
          phone: s.phone || existing.phone,
          status: s.status || existing.status,
          joiningDate: s.joiningDate || existing.joiningDate,
          avatar: s.avatar || existing.avatar,
        });
      } else if (email) {
        staffMap.set(email, {
          _id: s._id,
          id: s._id,
          dbId: s._id,
          facultyId: facId,
          staffId: facId,
          name: s.name,
          email: s.email,
          role: s.role || 'Faculty',
          designation: s.designation || 'Assistant Professor',
          department: normalizeDepartment(s.department),
          phone: s.phone || '',
          status: s.status || 'Active',
          joiningDate: s.joiningDate || s.createdAt || new Date(),
          avatar: s.avatar || null,
        });
      }
    });

    const staffList = Array.from(staffMap.values());
    return response(false, staffList, 'Staff fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch staff');
  }
};

/**
 * Get staff by ID
 * @param {string} id - Staff member ID
 * @returns {Promise<Object>} Formatted service response with specific staff profile
 */
exports.getById = async (id) => {
  try {
    const staff = await staffRepository.findById(id);
    if (!staff) return response(true, null, 'Staff not found');
    return response(false, staff, 'Staff fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch staff');
  }
};

/**
 * Update staff profile
 * @param {string} id - Staff member ID
 * @param {Object} data - Updates to apply
 * @returns {Promise<Object>} Formatted service response with modified staff data
 */
exports.update = async (id, data) => {
  try {
    // Faculty listed in the Staff Management page comes from the User collection.
    // Try updating the User document first; if not found, fall back to legacy Staff model.
    const allowedUserFields = ['name', 'phone', 'department', 'role', 'status'];
    const userUpdateData = {};
    allowedUserFields.forEach((field) => {
      if (data[field] !== undefined) userUpdateData[field] = data[field];
    });

    const updatedUser = await userRepository.update(id, userUpdateData);
    if (updatedUser) {
      return response(false, updatedUser, 'Staff updated successfully');
    }

    // Fallback: legacy Staff model
    const staff = await staffRepository.update(id, data);
    if (!staff) return response(true, null, 'Staff not found');
    return response(false, staff, 'Staff updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update staff');
  }
};

/**
 * Offboard staff member
 * @param {string} id - Staff member ID
 * @returns {Promise<Object>} Formatted service response with deletion status
 */
exports.remove = async (id) => {
  try {
    const staff = await staffRepository.remove(id);
    if (!staff) return response(true, null, 'Staff not found');
    return response(false, null, 'Staff deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete staff');
  }
};
