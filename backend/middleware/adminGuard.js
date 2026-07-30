const User = require('../models/user.model');
const Staff = require('../models/staff.model');
const sendResponse = require('../utils/response');

/**
 * Admin Security Guard Middleware
 * Rejects any request attempt to register or create an Admin user or elevate any user role to 'admin'.
 */
const rejectAdminCreation = (req, res, next) => {
  const role = req.body?.role ? String(req.body.role).toLowerCase().trim() : null;

  if (role === 'admin') {
    return sendResponse(
      res,
      {
        success: false,
        message: 'Super Admin account is protected and cannot be modified.',
        error: 'Forbidden',
      },
      403
    );
  }

  next();
};

/**
 * Super Admin Protection Middleware
 * Blocks PUT, PATCH, and DELETE requests targeting the Super Admin account.
 */
const protectSuperAdmin = async (req, res, next) => {
  try {
    const superAdminEmail = (
      process.env.SUPER_ADMIN_EMAIL ||
      process.env.ADMIN_EMAIL ||
      'er.bhavik5202@gmail.com'
    )
      .toLowerCase()
      .trim();

    if (['PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
      const targetId = req.params.id;

      if (targetId) {
        const [user, staff] = await Promise.all([
          User.findById(targetId).select('email role'),
          Staff.findById(targetId).select('email role'),
        ]);

        const targetEmail = (user?.email || staff?.email || '').toLowerCase().trim();
        const targetRole = (user?.role || staff?.role || '').toLowerCase().trim();

        if (targetEmail === superAdminEmail || targetRole === 'admin') {
          return sendResponse(
            res,
            {
              success: false,
              message: 'Super Admin account is protected and cannot be modified.',
              error: 'Forbidden',
            },
            403
          );
        }
      }

      const bodyEmail = req.body?.email ? String(req.body.email).toLowerCase().trim() : '';
      if (bodyEmail === superAdminEmail) {
        return sendResponse(
          res,
          {
            success: false,
            message: 'Super Admin account is protected and cannot be modified.',
            error: 'Forbidden',
          },
          403
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  rejectAdminCreation,
  protectSuperAdmin,
};
