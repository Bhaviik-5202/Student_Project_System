/**
 * User Service
 * Business logic layer for user-related operations.
 */
const userRepository = require('../repositories/user.repository');
const studentRepository = require('../repositories/student.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN;
const crypto = require('crypto');

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
exports.register = async ({ name, email, password, role = 'student' }) => {
  try {
    // Role validation: Only faculty and student are allowed to register publicly
    // Admin is a predefined role and cannot be registered via public signup
    if (role === 'admin') {
      return response(
        true,
        null,
        'The Administrator account is predefined. Please login with fixed credentials.'
      );
    }

    const finalRole = ['student', 'faculty'].includes(role) ? role : 'student';

    const existing = await userRepository.findByEmail(email);
    if (existing) return response(true, null, 'Email already registered');

    const user = await userRepository.create({
      name,
      email,
      password,
      role: finalRole,
    });

    // If registered as a student, create a student profile
    if (role === 'student') {
      await studentRepository.create({
        name,
        email,
        rollNumber: `TEMP-${Date.now()}`, // Temporary roll number until updated
        department: 'TBA',
        year: 1,
      });
    }

    return response(false, user, 'User registered successfully');
  } catch (err) {
    console.error('Registration error:', err);
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
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn,
    });

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
    console.error('Login error:', err);
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

    const user = await userRepository.create(data);
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
    const user = await userRepository.update(id, data);
    if (!user) return response(true, null, 'User not found');
    return response(false, user, 'User updated successfully');
  } catch (err) {
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
 * Process forgot password
 * @param {string} email - User email
 * @returns {Promise<Object>} Formatted service response with status message
 */
exports.forgotPassword = async (email) => {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return success to avoid email enumeration
      return response(
        false,
        null,
        'If the account exists, a reset link has been sent.'
      );
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await userRepository.update(user._id, {
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: Date.now() + 3600000, // 1 hour
    });

    // In a real app, send email here. For now, we'll log it or return it for testing.
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return response(false, null, 'Password reset link sent to email');
  } catch (err) {
    console.error('Forgot password error:', err);
    return response(
      true,
      null,
      err.message || 'Failed to process forgot password'
    );
  }
};

/**
 * Reset password using token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Formatted service response
 */
exports.resetPassword = async (token, newPassword) => {
  try {
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await userRepository.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return response(true, null, 'Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return response(false, null, 'Password has been reset successfully');
  } catch (err) {
    console.error('Reset password error:', err);
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
    console.error('Change password error:', err);
    return response(true, null, err.message || 'Failed to change password');
  }
};
