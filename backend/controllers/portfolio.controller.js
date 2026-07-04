const portfolioService = require('../services/portfolio.service');
const Student = require('../models/student.model');
const sendResponse = require('../utils/response');

/**
 * Portfolio Controller
 * Manages student professional portfolios and project showcases.
 */

/**
 * Create a new student portfolio
 * @route POST /portfolios
 * @access Student
 */
exports.createPortfolio = async (req, res) => {
  try {
    const portfolioData = { ...req.body };

    // If caller didn't provide a student ID, resolve it from the authenticated user's student profile
    if (!portfolioData.student && req.user && req.user.email) {
      const studentDoc = await Student.findOne({ email: req.user.email }).lean();
      if (studentDoc && studentDoc._id) {
        portfolioData.student = studentDoc._id;
      } else {
        // Fallback to the user id if a student profile doesn't exist (legacy)
        portfolioData.student = req.user.id;
      }
    }
    const result = await portfolioService.createPortfolio(portfolioData);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? result.message
          : 'Portfolio created successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201
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
 * Fetch a portfolio by student ID
 * @route GET /portfolios/student/:studentId
 * @access Authenticated
 */
exports.getPortfolioByStudent = async (req, res) => {
  try {
    // RBAC: Only owner, admin, or faculty can view
    const isAdminOrFaculty = ['admin', 'faculty'].includes(String(req.user && req.user.role));

    // Determine ownership by mapping student -> user (students and users are linked by email)
    const studentDoc = await Student.findById(req.params.studentId).lean();
    const isOwner = !!(
      studentDoc && req.user && String(studentDoc.email).toLowerCase() === String(req.user.email).toLowerCase()
    );

    if (!isOwner && !isAdminOrFaculty) {
      return sendResponse(res, { success: false, message: 'Access denied' }, 403);
    }

    const result = await portfolioService.getPortfolioByStudent(req.params.studentId);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Portfolio not found'
          : 'Portfolio fetched successfully',
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
 * Fetch portfolio for the authenticated user (student)
 * @route GET /portfolios/me
 */
exports.getMyPortfolio = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return sendResponse(res, { success: false, message: 'Unauthorized' }, 401);
    }

    const studentDoc = await Student.findOne({ email: req.user.email }).lean();
    if (!studentDoc || !studentDoc._id) {
      return sendResponse(res, { success: false, message: 'Student profile not found' }, 404);
    }

    const result = await portfolioService.getPortfolioByStudent(studentDoc._id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Portfolio not found' : 'Portfolio fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: 'Internal server error', data: null, error: error.message }, 500);
  }
};

/**
 * List portfolios (admin/faculty)
 * @route GET /portfolios
 */
exports.listPortfolios = async (req, res) => {
  try {
    const filter = {};
    const result = await portfolioService.getAll(filter, {});
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Failed to list portfolios' : 'Portfolios listed successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: 'Internal server error', data: null, error: error.message }, 500);
  }
};

/**
 * Get portfolio by ID
 * @route GET /portfolios/:id
 */
exports.getById = async (req, res) => {
  try {
    const result = await portfolioService.getById(req.params.id);
    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error ? 'Portfolio not found' : 'Portfolio fetched successfully',
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200
    );
  } catch (error) {
    sendResponse(res, { success: false, message: 'Internal server error', data: null, error: error.message }, 500);
  }
};

/**
 * Delete a portfolio by ID
 * @route DELETE /portfolios/:id
 */
exports.deletePortfolio = async (req, res) => {
  try {
    // Only admin/faculty or owner can delete
    const portfolioResult = await portfolioService.getById(req.params.id);
    if (portfolioResult.error) return sendResponse(res, { success: false, message: 'Portfolio not found' }, 404);

    const Student = require('../models/student.model');
    const studentDoc = await Student.findById(portfolioResult.data.student).lean();
    const isOwner = studentDoc && req.user && String(studentDoc.email).toLowerCase() === String(req.user.email).toLowerCase();
    const isAdminOrFaculty = ['admin', 'faculty'].includes(String(req.user && req.user.role));
    if (!isOwner && !isAdminOrFaculty) return sendResponse(res, { success: false, message: 'Access denied' }, 403);

    const result = await portfolioService.remove(req.params.id);
    sendResponse(res, { success: !result.error, message: result.error ? 'Failed to delete' : 'Portfolio deleted successfully', data: null, error: result.error || null }, result.error ? 400 : 200);
  } catch (error) {
    sendResponse(res, { success: false, message: 'Internal server error', data: null, error: error.message }, 500);
  }
};

/**
 * Update an existing portfolio
 * @route PUT /portfolios/:id
 * @access Student
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await portfolioService.getById(req.params.id);
    if (!portfolio || portfolio.error) {
      return sendResponse(
        res,
        { success: false, message: 'Portfolio not found' },
        404
      );
    }

    // RBAC: Only owner, admin, or faculty can update
    const isAdminOrFacultyUpdate = ['admin', 'faculty'].includes(String(req.user && req.user.role));
    let isOwnerUpdate = false;
    if (portfolio && portfolio.data && portfolio.data.student) {
      const studentDoc2 = await Student.findById(portfolio.data.student).lean();
      isOwnerUpdate = !!(
        studentDoc2 && req.user && String(studentDoc2.email).toLowerCase() === String(req.user.email).toLowerCase()
      );
    }

    if (!isOwnerUpdate && !isAdminOrFacultyUpdate) {
      return sendResponse(res, { success: false, message: 'Access denied' }, 403);
    }

    const result = await portfolioService.updatePortfolio(
      req.params.id,
      req.body
    );

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Portfolio not found'
          : 'Portfolio updated successfully',
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
