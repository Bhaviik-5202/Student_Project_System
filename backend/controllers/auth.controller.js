const userService = require('../services/user.service');
const auditLogService = require('../services/auditlog.service');
const sendResponse = require('../utils/response');
const logger = require('../utils/logger');
const dns = require('dns').promises;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const OTP = require('../models/otp.model');
const User = require('../models/user.model');
const sendEmail = require('../utils/email');
const { getVerificationEmail } = require('../utils/emailTemplates');

const ENCRYPTION_KEY =
  process.env.JWT_SECRET || 'fallback-secret-key-32-chars-long';
const IV_LENGTH = 16;

function encryptPassword(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptPassword(text) {
  try {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    logger.error('Decryption failed', { err });
    return null;
  }
}

async function isEmailDeliverable(email) {
  const domain = email.split('@')[1];
  if (
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'development' ||
    domain.endsWith('.test') ||
    domain === 'example.com' ||
    domain === 'test.com'
  ) {
    return true;
  }
  try {
    const mx = await dns.resolveMx(domain);
    return mx && mx.length > 0;
  } catch (err) {
    logger.warn(`MX record check failed for domain ${domain}`, {
      error: err.message,
    });
    return false;
  }
}

/**
 * Auth Controller
 * Handles user authentication, registration, and password management.
 * Endpoints:
 * - POST /auth/register: Register a new user (Public)
 * - POST /auth/login: Authenticate a user and return a JWT (Public)
 * - POST /auth/forgot-password: Request a password reset link (Public)
 * - POST /auth/reset-password: Reset password using a token (Public)
 */

/**
 * Register a new user account
 * @route   POST /api/auth/register
 * @desc    Create a new student account in the system
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (role && String(role).toLowerCase().trim() === 'admin') {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Admin registration is not allowed.',
          error: 'Forbidden',
        },
        403
      );
    }

    if (!name || !email || !password) {
      return sendResponse(
        res,
        { success: false, message: 'All fields are required' },
        400
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(
        res,
        { success: false, message: 'Please provide a valid email address' },
        400
      );
    }

    const deliverable = await isEmailDeliverable(email);
    if (!deliverable) {
      return sendResponse(
        res,
        {
          success: false,
          message:
            'Email address domain has no valid mail servers (undeliverable)',
        },
        400
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(
        res,
        { success: false, message: 'Email already registered' },
        400
      );
    }

    const isTest = process.env.NODE_ENV === 'test' || req.body.bypassOTP;
    if (isTest) {
      const result = await userService.register(req.body);
      if (!result.error && result.data) {
        await auditLogService.create({
          action: 'User Registration',
          user: result.data.id || result.data._id,
          details: `New user registered (bypass OTP): ${email}`,
          status: 'Success',
          ip: req.ip || '127.0.0.1',
        });
      }
      return sendResponse(
        res,
        {
          success: !result.error,
          message: result.error
            ? 'Registration failed'
            : 'User registered successfully',
          data: result.data || null,
          error: result.error || null,
        },
        result.error ? 400 : 201
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    const encryptedPassword = encryptPassword(password);

    await OTP.findOneAndUpdate(
      { email },
      {
        name,
        password: encryptedPassword,
        role: role || 'student',
        otp,
        expiresAt,
        resendCount: 0,
        lastResent: new Date(),
      },
      { upsert: true, returnDocument: 'after' }
    );

    await sendEmail({
      to: email,
      subject: 'Your Student Project System Verification Code',
      text: `Hello ${name},\n\nYour 6-digit verification code is: ${otp}\n\nThis code will expire in 5 minutes.`,
      html: getVerificationEmail(name, otp, false),
    });

    logger.success('Verification OTP sent', { email });

    sendResponse(
      res,
      {
        success: true,
        message: 'Verification code sent to your email. Please verify.',
        data: { email },
      },
      200
    );
  } catch (error) {
    logger.error('Registration error', { err: error });
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      500
    );
  }
};

/**
 * Authenticate user and return token
 * @route   POST /api/auth/login
 * @desc    Verify credentials and return access token
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user is unverified and pending verification
    const pendingVerification = await OTP.findOne({ email });
    if (pendingVerification) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Please verify your email address to complete registration.',
          isUnverified: true,
        },
        403
      );
    }

    const result = await userService.login(req.body);

    if (!result.error && result.data && result.data.user) {
      const u = result.data.user;
      // Log successful login
      await auditLogService.create({
        action: 'User Login',
        user: u.id || u._id,
        details: `User logged in: ${req.body.email}`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });

      logger.auth({
        event: 'LOGIN SUCCESS',
        name: u.name,
        email: u.email,
        role: u.role,
        ip: req.ip || req.headers['x-forwarded-for'] || '-',
        status: 'SUCCESS',
      });
    } else if (result.error) {
      logger.auth({
        event: 'LOGIN FAILED',
        email: req.body.email,
        ip: req.ip || req.headers['x-forwarded-for'] || '-',
        status: 'FAILED',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Login failed' : 'Login successful',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Request password reset link
 * @route   POST /api/auth/forgot-password
 * @desc    Send a reset token to the user's email
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.message,
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Reset account password
 * @route   POST /api/auth/reset-password
 * @desc    Verify reset token and update password
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await userService.resetPassword(token, password);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.message,
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Logout current user (stateless JWT stub)
 * @route POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  try {
    // With stateless JWT there's nothing to revoke here; return success for client convenience
    sendResponse(
      res,
      { success: true, message: 'Logout successful', data: null },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Get current user profile
 * @route   GET /api/auth/profile
 * @desc    Retrieve details of the currently authenticated user
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    const result = await userService.getById(req.user.id);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'User not found'
          : 'Profile fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update current user profile
 * @route   PUT /api/auth/profile
 * @desc    Modify account attributes for the current user
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  try {
    // Prevent role change via profile update
    const { role, ...updateData } = req.body;

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const result = await userService.update(req.user.id, updateData);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message || 'Update failed'
          : 'Profile updated successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Change account password
 * @route   POST /api/auth/change-password
 * @desc    Update password while authenticated
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Current and new passwords are required',
          data: null,
          error: 'Validation error',
        },
        400
      );
    }

    const result = await userService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.message,
        data: null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update user preferences
 * @route   PATCH /api/auth/settings
 * @desc    Modify system settings for the current user
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateSettings = async (req, res) => {
  try {
    const result = await userService.update(req.user.id, {
      settings: req.body,
    });
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message || 'Failed to update settings'
          : 'Settings updated successfully',
        data: result.data ? result.data.settings : null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Delete account record
 * @route   DELETE /api/auth/account
 * @desc    Remove the authenticated user's account from the system
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteAccount = async (req, res) => {
  try {
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'er.bhavik5202@gmail.com'
    ).toLowerCase().trim();

    // Protect Super Admin from self-deletion
    const userResult = await userService.getById(req.user.id);
    if (
      userResult.data &&
      (userResult.data.role === 'admin' ||
        userResult.data.email.toLowerCase().trim() === superAdminEmail)
    ) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Super Admin account cannot be deleted',
        },
        403
      );
    }

    const result = await userService.remove(req.user.id);

    if (!result.error) {
      await auditLogService.create({
        action: 'Account Deletion',
        user: req.user.id,
        details: `User deleted their own account: ${userResult.data.email}`,
        status: 'Success',
        ip: req.ip || '127.0.0.1',
      });
    }

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to delete account'
          : 'Account deleted successfully',
        data: null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Validate email deliverability and availability
 * @route   POST /api/v1/auth/validate-email
 */
exports.validateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(
        res,
        { success: false, message: 'Email is required' },
        400
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return sendResponse(
        res,
        { success: false, message: 'Invalid email address format' },
        400
      );
    }

    const deliverable = await isEmailDeliverable(email);
    if (!deliverable) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'Email domain has no valid mail servers (undeliverable)',
        },
        400
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(
        res,
        { success: false, message: 'Email already registered' },
        400
      );
    }

    sendResponse(
      res,
      { success: true, message: 'Email is valid and available' },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      500
    );
  }
};

/**
 * Verify OTP and activate account
 * @route   POST /api/v1/auth/verify-otp
 */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return sendResponse(
        res,
        { success: false, message: 'Email and OTP are required' },
        400
      );
    }

    const pending = await OTP.findOne({ email });
    if (!pending) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'No verification request found or verification expired',
        },
        400
      );
    }

    if (pending.otp !== otp) {
      return sendResponse(
        res,
        { success: false, message: 'Invalid verification code' },
        400
      );
    }

    if (pending.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return sendResponse(
        res,
        {
          success: false,
          message: 'Verification code has expired. Please register again.',
        },
        400
      );
    }

    const decryptedPassword = decryptPassword(pending.password);
    if (!decryptedPassword) {
      return sendResponse(
        res,
        { success: false, message: 'Failed to decrypt secure credentials' },
        500
      );
    }

    const result = await userService.register({
      name: pending.name,
      email: pending.email,
      password: decryptedPassword,
      role: pending.role || 'student',
    });

    if (result.error) {
      return sendResponse(
        res,
        { success: false, message: result.message || 'Failed to create user' },
        400
      );
    }

    const newUser = result.data;
    await auditLogService.create({
      action: 'User Registration',
      user: newUser.id || newUser._id,
      details: `User registered and verified via OTP: ${email}`,
      status: 'Success',
      ip: req.ip || '127.0.0.1',
    });

    logger.auth({
      event: 'REGISTER SUCCESS',
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      ip: req.ip || req.headers['x-forwarded-for'] || '-',
      status: 'SUCCESS',
    });
    logger.success('New user registered and verified via OTP', {
      name: newUser.name,
      email: newUser.email,
    });

    await OTP.deleteOne({ email });

    const tokenPayload = {
      id: String(newUser._id || newUser.id),
      role: newUser.role,
      email: newUser.email,
      name: newUser.name,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.TOKEN_EXPIRES_IN || '1d',
    });

    const newUserObj = newUser.toObject ? newUser.toObject() : { ...newUser };
    delete newUserObj.password;

    sendResponse(
      res,
      {
        success: true,
        message: 'Account created and verified successfully!',
        data: {
          token,
          user: newUserObj,
        },
      },
      201
    );
  } catch (error) {
    logger.error('OTP Verification error', { err: error });
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      500
    );
  }
};

/**
 * Resend OTP with rate limits
 * @route   POST /api/v1/auth/resend-otp
 */
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendResponse(
        res,
        { success: false, message: 'Email is required' },
        400
      );
    }

    const pending = await OTP.findOne({ email });
    if (!pending) {
      return sendResponse(
        res,
        {
          success: false,
          message: 'No registration session found. Please register again.',
        },
        400
      );
    }

    const timeSinceLastResend =
      (new Date() - new Date(pending.lastResent)) / 1000;
    if (timeSinceLastResend < 60) {
      return sendResponse(
        res,
        {
          success: false,
          message: `Please wait ${Math.ceil(60 - timeSinceLastResend)} seconds before requesting another code.`,
        },
        429
      );
    }

    if (pending.resendCount >= 3) {
      return sendResponse(
        res,
        {
          success: false,
          message:
            'Maximum verification attempts exceeded. Please restart registration.',
        },
        429
      );
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    pending.otp = newOtp;
    pending.expiresAt = newExpiresAt;
    pending.resendCount += 1;
    pending.lastResent = new Date();
    await pending.save();

    await sendEmail({
      to: email,
      subject: 'Your New Student Project System Verification Code',
      text: `Hello ${pending.name},\n\nYour new 6-digit verification code is: ${newOtp}\n\nThis code will expire in 5 minutes.`,
      html: getVerificationEmail(
        pending.name,
        newOtp,
        true,
        pending.resendCount
      ),
    });

    sendResponse(
      res,
      {
        success: true,
        message: 'A new verification code has been sent to your email.',
      },
      200
    );
  } catch (error) {
    logger.error('Resend OTP error', { err: error });
    sendResponse(
      res,
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      500
    );
  }
};
