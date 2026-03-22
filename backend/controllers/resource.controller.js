const resourceService = require('../services/resource.service');
const sendResponse = require('../utils/response');

/**
 * Resource Controller
 * Manages shared learning materials, project documentation, and digital assets.
 */

/**
 * Register a new learning resource or document
 * @route POST /resources
 * @access Admin, Faculty
 */
exports.createResource = async (req, res) => {
  try {
    const { title, type, description, url } = req.body;
    const uploadedBy = req.user.id;
    const createdResources = [];

    // Handle file uploads (can be multiple)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const resourceData = {
          title:
            req.files.length === 1
              ? title || file.originalname.split('.')[0]
              : file.originalname.split('.')[0],
          type: type || 'document',
          description,
          uploadedBy,
          url: file.path.replace(/\\/g, '/'),
        };
        const result = await resourceService.create(resourceData);
        if (result && !result.error && result.data) {
          createdResources.push(result.data);
        }
      }
    } else {
      // Handle manual entry (e.g., video URL or image URL)
      const resourceData = {
        title,
        type: type || 'document',
        description,
        url,
        uploadedBy,
      };
      const result = await resourceService.create(resourceData);
      if (result && !result.error && result.data) {
        createdResources.push(result.data);
      } else if (result && result.error) {
        throw new Error(result.message || 'Failed to create resource');
      }
    }

    sendResponse(
      res,
      {
        success: true,
        message: `${createdResources.length} resource(s) created successfully`,
        data:
          createdResources.length === 1
            ? createdResources[0]
            : createdResources,
      },
      201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to create resource',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Fetch all available resources across all categories
 * @route GET /resources
 * @access Authenticated
 */
exports.getAllResources = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await resourceService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      filters,
    });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch resources'
          : 'Resources fetched successfully',
        data: result.data ? result.data.resources : null,
        error: result.error || null,
        pagination: result.data
          ? {
              total: result.data.total,
              page: result.data.page,
              limit: result.data.limit,
              totalPages: result.data.totalPages,
            }
          : null,
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
 * Get detailed information for a specific resource
 * @route GET /resources/:id
 * @access Authenticated
 */
exports.getResourceById = async (req, res) => {
  try {
    const result = await resourceService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Resource not found'
          : 'Resource fetched successfully',
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
 * Update resource metadata or download link
 * @route PUT /resources/:id
 * @access Admin, Faculty
 */
exports.updateResource = async (req, res) => {
  try {
    const result = await resourceService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Resource not found'
          : 'Resource updated successfully',
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
 * Permanently remove a resource
 * @route DELETE /resources/:id
 * @access Admin
 */
exports.deleteResource = async (req, res) => {
  try {
    const result = await resourceService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Resource not found'
          : 'Resource deleted successfully',
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
