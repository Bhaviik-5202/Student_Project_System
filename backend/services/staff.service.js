/**
 * Staff Service
 * Business logic layer for staff-related operations.
 */
const staffRepository = require('../repositories/staff.repository');
const userRepository = require('../repositories/user.repository');
const cascadeUserCleanup = require('../utils/cascadeCleanup');
const {
  generateFacultyId,
  normalizeDepartment,
} = require('../utils/idGenerator');

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
    return response(true, null, err.message || 'Failed to create staff member');
  }
};

/**
 * Fetch all registered faculty staff members
 * @returns {Promise<Object>} Formatted service response with staff list
 */
exports.getAll = async () => {
  try {
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'er.bhavik5202@gmail.com'
    )
      .toLowerCase()
      .trim();

    const [facultyUsers, legacyStaff] = await Promise.all([
      userRepository.findAll(
        { role: 'faculty', email: { $ne: superAdminEmail } },
        { select: '-password', lean: true }
      ),
      staffRepository.findAll({
        email: { $ne: superAdminEmail },
        role: { $ne: 'admin' },
      }),
    ]);

    const staffMap = new Map();

    (facultyUsers || []).forEach((u) => {
      const email = u.email?.toLowerCase().trim();
      if (!email || email === superAdminEmail || u.role === 'admin') return;

      const facId =
        u.facultyId ||
        u.staffId ||
        `FAC${new Date().getFullYear()}${u._id.toString().slice(-4).toUpperCase()}`;
      staffMap.set(email, {
        _id: u._id,
        id: u._id,
        dbId: u._id,
        facultyId: facId,
        staffId: facId,
        name: u.name,
        email: u.email,
        role: 'Faculty',
        designation: u.designation || 'Assistant Professor',
        department: normalizeDepartment(u.department),
        phone: u.phone || '',
        status: u.status === 'inactive' ? 'Inactive' : 'Active',
        joiningDate: u.joiningDate || u.createdAt || new Date(),
        avatar: u.avatar || null,
      });
    });

    (legacyStaff || []).forEach((s) => {
      const email = s.email?.toLowerCase().trim();
      if (!email || email === superAdminEmail || s.role === 'admin') return;

      const facId =
        s.facultyId ||
        s.staffId ||
        `FAC${new Date().getFullYear()}${s._id.toString().slice(-4).toUpperCase()}`;
      if (staffMap.has(email)) {
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
      } else {
        staffMap.set(email, {
          _id: s._id,
          id: s._id,
          dbId: s._id,
          facultyId: facId,
          staffId: facId,
          name: s.name,
          email: s.email,
          role: 'Faculty',
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
    let staff = await staffRepository.findById(id);
    if (!staff) {
      const user = await userRepository.findById(id, {
        select: '-password',
        lean: true,
      });
      if (user && (user.role === 'faculty' || user.role === 'admin')) {
        const existingStaff = await staffRepository.findByEmail(user.email);
        if (existingStaff) {
          staff = existingStaff;
        } else {
          staff = {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            department: normalizeDepartment(user.department),
            designation:
              user.role === 'admin'
                ? 'Head of Department'
                : 'Assistant Professor',
            phone: user.phone || '',
            status: user.status === 'inactive' ? 'Inactive' : 'Active',
            role: user.role,
          };
        }
      }
    }

    if (!staff) {
      return response(
        true,
        null,
        'Staff member does not exist or has already been deleted.'
      );
    }
    return response(false, staff, 'Staff member fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch staff member');
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
    const allowedUserFields = ['name', 'phone', 'department', 'role', 'status'];
    const userUpdateData = {};
    allowedUserFields.forEach((field) => {
      if (data[field] !== undefined) userUpdateData[field] = data[field];
    });

    const updatedUser = await userRepository.update(id, userUpdateData);
    if (updatedUser) {
      const staffRecord = await staffRepository.findByEmail(updatedUser.email);
      if (staffRecord) {
        await staffRepository.update(staffRecord._id, data);
      }
      return response(false, updatedUser, 'Staff updated successfully');
    }

    const staff = await staffRepository.update(id, data);
    if (!staff) {
      return response(
        true,
        null,
        'Staff member does not exist or has already been deleted.'
      );
    }
    return response(false, staff, 'Staff updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update staff member');
  }
};

/**
 * Offboard staff member
 * @param {string} id - Staff member ID
 * @returns {Promise<Object>} Formatted service response with deletion status
 */
exports.remove = async (id) => {
  try {
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'er.bhavik5202@gmail.com'
    )
      .toLowerCase()
      .trim();

    let staff = await staffRepository.findById(id);
    let user = null;

    if (staff) {
      if (staff.email && staff.email.toLowerCase().trim() === superAdminEmail) {
        return response(true, null, 'Super Admin account cannot be deleted.');
      }
      staff = await staffRepository.remove(id);
      if (staff && staff.email) {
        const linkedUser = await userRepository.findByEmail(staff.email);
        if (linkedUser) {
          if (
            linkedUser.role !== 'admin' &&
            linkedUser.email.toLowerCase().trim() !== superAdminEmail
          ) {
            user = await userRepository.remove(linkedUser._id);
          }
        }
      }
    } else {
      user = await userRepository.findById(id);
      if (user) {
        if (
          user.role === 'admin' ||
          user.email.toLowerCase().trim() === superAdminEmail
        ) {
          return response(true, null, 'Super Admin account cannot be deleted.');
        }
        user = await userRepository.remove(id);
        const staffRecord = await staffRepository.findByEmail(user.email);
        if (staffRecord) {
          staff = await staffRepository.remove(staffRecord._id);
        }
      }
    }

    if (!staff && !user) {
      return response(
        true,
        null,
        'Staff member does not exist or has already been deleted.'
      );
    }

    const targetEmail = staff?.email || user?.email;
    const targetUserId = user?._id || staff?._id;
    await cascadeUserCleanup(targetUserId, targetEmail);

    return response(false, null, 'Staff member deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete staff member');
  }
};
