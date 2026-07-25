/**
 * User Service
 * Business logic layer for user-related operations.
 */
const userRepository = require('../repositories/user.repository');
const studentRepository = require('../repositories/student.repository');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { getPasswordResetEmail } = require('../utils/emailTemplates');
const notificationService = require('./notification.service');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Register a new user
 * @param {Object} userData - User registration payload
 * @param {string} userData.name - Full name of the user
 * @param {string} userData.email - Unique email address
 * @param {string} userData.password - Plain text password (hashed before save)
 * @param {string} userData.role - User role (student, faculty)
 * @returns {Promise<Object>} Formatted service response with new user data
 */
const {
  generateRollNumber,
  generateFacultyId,
  normalizeDepartment,
} = require('../utils/idGenerator');

exports.register = async ({
  name,
  email,
  password,
  role = 'student',
  department,
  phone,
}) => {
  try {
    const validRoles = ['student', 'faculty', 'admin'];
    const finalRole = validRoles.includes(role) ? role : 'student';

    const existing = await userRepository.findByEmail(email);
    if (existing) return response(true, null, 'Email already registered');

    const cleanDepartment = normalizeDepartment(department);
    const userData = {
      name,
      email,
      password,
      role: finalRole,
      department: cleanDepartment,
      phone: phone || '',
    };

    if (finalRole === 'student') {
      userData.rollNumber = await generateRollNumber();
      userData.enrollmentNumber = `EN${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (finalRole === 'faculty' || finalRole === 'admin') {
      userData.facultyId = await generateFacultyId();
    }

    const user = await userRepository.create(userData);

    // Synchronize Profile in Student or Staff Collection
    if (finalRole === 'student') {
      await studentRepository.create({
        name,
        email,
        rollNumber: userData.rollNumber,
        enrollmentNumber: userData.enrollmentNumber,
        department: cleanDepartment,
        year: 1,
        phone: phone || '',
        status: 'Active',
      });
    } else if (finalRole === 'faculty' || finalRole === 'admin') {
      const staffRepository = require('../repositories/staff.repository');
      await staffRepository.create({
        name,
        email,
        facultyId: userData.facultyId,
        department: cleanDepartment,
        designation: 'Assistant Professor',
        phone: phone || '',
        status: 'Active',
        role: finalRole,
      });
    }

    notificationService.create({
      user: user._id,
      message: `Welcome to Student Project System, ${user.name}!`,
      type: 'success',
      metadata: { type: 'system', link: '/profile' }
    }).catch(console.error);

    userRepository.findAll({ role: 'admin' }).then(admins => {
      admins.forEach(admin => {
        notificationService.create({
          user: admin._id,
          message: `New ${finalRole} registered: ${user.name}`,
          type: 'info',
          metadata: { type: 'system', link: '/users' }
        }).catch(console.error);
      });
    }).catch(console.error);

    return response(false, user, 'User registered successfully');
  } catch (err) {
    logger.error('Registration error', { err });
    return response(true, null, err.message || 'Registration failed');
  }
};

/**
 * Authenticate user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Account email
 * @param {string} credentials.password - Account password
 * @returns {Promise<Object>} Formatted service response with JWT token and profile
 */
exports.login = async ({ email, password }) => {
  try {
    const user = await userRepository.findByEmail(email, {
      select: '+password',
    });
    if (!user || !user.password)
      return response(true, null, 'Invalid credentials');

    const match = await user.comparePassword(password);
    if (!match) return response(true, null, 'Invalid credentials');

    let expiresIn = TOKEN_EXPIRES_IN || '1d';
    const token = jwt.sign(
      {
        id: String(user._id),
        role: user.role,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn }
    );

    return response(
      false,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      'Login successful'
    );
  } catch (err) {
    logger.error('Login error', { err });
    return response(true, null, err.message || 'Login failed');
  }
};

/**
 * Fetch all registered users
 * @returns {Promise<Object>} Formatted service response with user list
 */
exports.getAll = async () => {
  try {
    const users = await userRepository.findAll({}, { lean: true });
    return response(false, users, 'Users fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch users');
  }
};

/**
 * Fetch all users with optional filtering by role and status
 * @param {Object} query - Query parameters (role, status)
 * @returns {Promise<Object>} Formatted service response with users list
 */
exports.getAll = async (query = {}) => {
  try {
    const filter = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;

    const users = await userRepository.findAll(filter, {
      sort: { createdAt: -1 },
      select: '-password',
      lean: true,
    });
    return response(false, users, 'Users fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch users');
  }
};

/**
 * Get user by ID
 * @param {string} id - User UUID/ObjectID
 * @returns {Promise<Object>} Formatted service response with user profile
 */
exports.getById = async (id) => {
  try {
    const user = await userRepository.findById(id, { lean: true });
    if (!user) return response(true, null, 'User not found');
    return response(false, user, 'User fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch user');
  }
};

/**
 * Create a user (Admin/System use)
 * @param {Object} data - User creation data
 * @returns {Promise<Object>} Formatted service response with new user data
 */
exports.create = async (data) => {
  try {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) return response(true, null, 'Email already exists');

    const cleanDepartment = normalizeDepartment(data.department);
    const userData = {
      ...data,
      department: cleanDepartment,
    };

    if (userData.role === 'student' && !userData.rollNumber) {
      userData.rollNumber = await generateRollNumber();
      userData.enrollmentNumber = `EN${new Date().getFullYear()}${Math.floor(100000 + Math.random() * 900000)}`;
    } else if (
      (userData.role === 'faculty' || userData.role === 'admin') &&
      !userData.facultyId
    ) {
      userData.facultyId = await generateFacultyId();
    }

    const user = await userRepository.create(userData);

    if (user.role === 'student') {
      await studentRepository.create({
        name: user.name,
        email: user.email,
        rollNumber: user.rollNumber,
        enrollmentNumber: user.enrollmentNumber,
        department: cleanDepartment,
        year: Number(user.year) || 1,
        phone: user.phone || '',
        status: user.status === 'active' ? 'Active' : 'Inactive',
        avatar: user.avatar || null,
      });
    } else if (user.role === 'faculty' || user.role === 'admin') {
      const staffRepository = require('../repositories/staff.repository');
      await staffRepository.create({
        name: user.name,
        email: user.email,
        facultyId: user.facultyId,
        department: cleanDepartment,
        designation: user.designation || 'Assistant Professor',
        phone: user.phone || '',
        status: user.status === 'active' ? 'Active' : 'Inactive',
        role: user.role,
        avatar: user.avatar || null,
      });
    }

    notificationService.create({
      user: user._id,
      message: `Your account has been created by an administrator. Welcome, ${user.name}!`,
      type: 'success',
      metadata: { type: 'system', link: '/profile' }
    }).catch(console.error);

    return response(false, user, 'User created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create user');
  }
};

/**
 * Update user attributes
 * @param {string} id - User ID
 * @param {Object} data - Attributes to update
 * @returns {Promise<Object>} Formatted service response with updated user
 */
exports.update = async (id, data) => {
  try {
    const updatePayload = { ...data };

    if (updatePayload.password && updatePayload.password.trim() !== '') {
      const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
      updatePayload.password = await bcrypt.hash(
        updatePayload.password,
        saltRounds
      );
    } else {
      delete updatePayload.password;
    }

    if (updatePayload.department) {
      updatePayload.department = normalizeDepartment(updatePayload.department);
    }

    const user = await userRepository.update(id, updatePayload);
    if (!user) return response(true, null, 'User not found');

    if (user.role === 'student') {
      const studentRecord = await studentRepository.findByEmail(user.email);
      if (studentRecord) {
        await studentRepository.update(studentRecord._id, {
          name: user.name,
          email: user.email,
          department: user.department,
          phone: user.phone || '',
          status:
            user.status === 'active' || user.status === 'Active'
              ? 'Active'
              : 'Inactive',
        });
      }
    } else if (user.role === 'faculty' || user.role === 'admin') {
      const staffRepository = require('../repositories/staff.repository');
      const staffRecord = await staffRepository.findOne({ email: user.email });
      if (staffRecord) {
        await staffRepository.update(staffRecord._id, {
          name: user.name,
          email: user.email,
          department: user.department,
          phone: user.phone || '',
          status:
            user.status === 'active' || user.status === 'Active'
              ? 'Active'
              : 'Inactive',
          role: user.role,
        });
      }
    }

    return response(false, user, 'User updated successfully');
  } catch (err) {
    logger.error('Update user error', { err: err.message, stack: err.stack });
    return response(true, null, err.message || 'Failed to update user');
  }
};

/**
 * Delete a user from the system
 * @param {string} id - User ID
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id) => {
  try {
    const user = await userRepository.remove(id);
    if (!user) return response(true, null, 'User not found');
    return response(false, null, 'User deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete user');
  }
};

/**
 * Process forgot password — generates a secure token and sends a reset email
 * @param {string} email - User email
 * @returns {Promise<Object>} Formatted service response with status message
 */
exports.forgotPassword = async (email) => {
  // Generic message to prevent email enumeration attacks
  const GENERIC_MSG =
    'If that email is registered, a password reset link has been sent.';

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return response(false, null, GENERIC_MSG);
    }

    // --- Rate-limit: block if a valid token was generated within the last 60 seconds ---
    const existingUser = await User.findById(user._id).select(
      '+resetPasswordToken +resetPasswordExpires'
    );

    if (
      existingUser.resetPasswordToken &&
      existingUser.resetPasswordExpires &&
      existingUser.resetPasswordExpires >
        Date.now() +
          ((Number(process.env.RESET_TOKEN_EXPIRES_MS) || 1800000) - 60000)
    ) {
      return response(false, null, GENERIC_MSG);
    }

    // --- Generate secure, one-time reset token ---
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const expiresMs = Number(process.env.RESET_TOKEN_EXPIRES_MS) || 1800000; // 30 min default

    await userRepository.update(user._id, {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: Date.now() + expiresMs,
    });

    // --- Build reset URL ---
    const frontendUrl = (
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ).replace(/\/$/, '');
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    const expiryMinutes = Math.round(expiresMs / 60000);

    // --- Send password reset email ---
    await sendEmail({
      to: email,
      subject: 'Reset Your Password — Student Project System',
      text:
        `Hello ${user.name},\n\n` +
        `We received a request to reset your password for your Student Project System account.\n\n` +
        `Click the link below to create a new password (expires in ${expiryMinutes} minutes):\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, you can safely ignore this email — your password will not change.\n\n` +
        `For security, this link can only be used once.\n\n` +
        `— The Student Project System Team`,
      html: getPasswordResetEmail(user.name, resetUrl, expiryMinutes),
    });

    return response(false, null, GENERIC_MSG);
  } catch (err) {
    logger.error('Forgot password error', { err });
    return response(
      true,
      null,
      err.message || 'Failed to process forgot password request'
    );
  }
};

/**
 * Reset password using token
 * NOTE: We query the User model directly here (not via repository) because
 * resetPasswordToken and resetPasswordExpires have { select: false } on the
 * schema, so the generic repository.findOne() never returns them.
 * @param {string} token - Plain-text reset token (hashed before lookup)
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Formatted service response
 */
exports.resetPassword = async (token, newPassword) => {
  try {
    if (!token || !newPassword) {
      return response(true, null, 'Token and new password are required');
    }

    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Directly query the model and explicitly select the hidden token fields
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password +resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return response(
        true,
        null,
        'Reset link is invalid or has expired. Please request a new one.'
      );
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    // Invalidate the token so it can't be reused
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return response(
      false,
      null,
      'Your password has been reset successfully. You can now log in.'
    );
  } catch (err) {
    logger.error('Reset password error', { err });
    return response(true, null, err.message || 'Failed to reset password');
  }
};

/**
 * Change user password
 * @param {string} id - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Formatted service response
 */
exports.changePassword = async (id, currentPassword, newPassword) => {
  try {
    const user = await userRepository.findById(id, { select: '+password' });
    if (!user) return response(true, null, 'User not found');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return response(true, null, 'Incorrect current password');

    user.password = newPassword;
    await user.save();

    return response(false, null, 'Password changed successfully');
  } catch (err) {
    logger.error('Change password error', { err });
    return response(true, null, err.message || 'Failed to change password');
  }
};
