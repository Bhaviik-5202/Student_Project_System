/**
 * Resource Service
 * Business logic layer for educational resource and file management.
 */
const resourceRepository = require('../repositories/resource.repository');
const notificationService = require('./notification.service');
const userRepository = require('../repositories/user.repository');

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Register educational resource
 * @param {Object} data - Resource metadata and links
 * @returns {Promise<Object>} Formatted service response with new resource document
 */
exports.create = async (data) => {
  try {
    const resource = await resourceRepository.create(data);

    // Notify all active students about the new resource
    userRepository
      .findAll({ role: 'student', status: 'Active' })
      .then((students) => {
        students.forEach((student) => {
          notificationService
            .create({
              user: student._id,
              message: `New resource uploaded: ${resource.title}`,
              type: 'info',
              metadata: {
                type: 'resource',
                resourceId: resource._id,
                link: `/resources`,
              },
            })
            .catch(console.error);
        });
      })
      .catch(console.error);

    notificationService.notifyAdmins({
      message: `New resource uploaded: ${resource.title}`,
      type: 'info',
      metadata: {
        type: 'resource',
        resourceId: resource._id,
        link: `/resources`,
      },
    });

    return response(false, resource, 'Resource created successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to create resource');
  }
};

/**
 * Fetch all resources
 * @param {Object} params - Query and pagination parameters
 * @param {number} params.page - Target page number
 * @param {number} params.limit - Max records per page
 * @param {Object} params.filters - Filter conditions
 * @returns {Promise<Object>} Formatted service response with paginated resource data
 */
exports.getAll = async ({
  page = 1,
  limit = 20,
  filters = {},
  sort = 'latest',
} = {}) => {
  try {
    const mongoFilter = {};

    // Extract search query
    const searchQuery = filters.search || filters.q || filters.title;
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
      const regex = new RegExp(searchQuery.trim(), 'i');
      mongoFilter.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { tags: regex },
      ];
    }

    // Type filter
    if (filters.type && filters.type !== 'all' && filters.type !== 'All') {
      mongoFilter.type = filters.type.toLowerCase();
    }

    // Category filter
    if (
      filters.category &&
      filters.category !== 'all' &&
      filters.category !== 'All'
    ) {
      mongoFilter.category = new RegExp(`^${filters.category}$`, 'i');
    }

    // Status filter
    if (filters.status) {
      mongoFilter.status = filters.status.toLowerCase();
    }

    // Date range filter
    if (filters.date) {
      const now = new Date();
      if (filters.date === 'today') {
        const start = new Date(now.setHours(0, 0, 0, 0));
        mongoFilter.createdAt = { $gte: start };
      } else if (filters.date === 'this_week' || filters.date === 'week') {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        mongoFilter.createdAt = { $gte: start };
      } else if (filters.date === 'this_month' || filters.date === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        mongoFilter.createdAt = { $gte: start };
      } else if (filters.date === 'this_year' || filters.date === 'year') {
        const start = new Date(now.getFullYear(), 0, 1);
        mongoFilter.createdAt = { $gte: start };
      }
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    const sortKey = (filters.sort || sort || '').toLowerCase();
    if (sortKey === 'popular' || sortKey === 'downloads') {
      sortOption = { downloadsCount: -1, createdAt: -1 };
    } else if (sortKey === 'a-z' || sortKey === 'title_asc') {
      sortOption = { title: 1 };
    } else if (sortKey === 'z-a' || sortKey === 'title_desc') {
      sortOption = { title: -1 };
    } else if (sortKey === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const numericLimit = parseInt(limit) || 20;
    const numericPage = parseInt(page) || 1;
    const skip = (numericPage - 1) * numericLimit;

    const [resources, total] = await Promise.all([
      resourceRepository.findAll(mongoFilter, {
        skip,
        limit: numericLimit,
        sort: sortOption,
      }),
      resourceRepository.count(mongoFilter),
    ]);

    return response(
      false,
      {
        resources,
        total,
        page: numericPage,
        limit: numericLimit,
        totalPages: Math.ceil(total / numericLimit) || 1,
      },
      'Resources fetched successfully'
    );
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch resources');
  }
};

/**
 * Get resource by ID
 * @param {string} id - Resource identifier
 * @returns {Promise<Object>} Formatted service response with specific resource metadata
 */
exports.getById = async (id) => {
  try {
    const resource = await resourceRepository.findById(id);
    if (!resource) return response(true, null, 'Resource not found');
    return response(false, resource, 'Resource fetched successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to fetch resource');
  }
};

/**
 * Update resource metadata
 * @param {string} id - Resource ID
 * @param {Object} data - Update payload
 * @returns {Promise<Object>}
 */
exports.update = async (id, data) => {
  try {
    const resource = await resourceRepository.update(id, data);
    if (!resource) return response(true, null, 'Resource not found');
    return response(false, resource, 'Resource updated successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to update resource');
  }
};

/**
 * Delete resource record
 * @param {string} id - Resource identifier
 * @returns {Promise<Object>} Formatted service response with removal status
 */
exports.remove = async (id) => {
  try {
    const resource = await resourceRepository.remove(id);
    if (!resource) return response(true, null, 'Resource not found');
    return response(false, null, 'Resource deleted successfully');
  } catch (err) {
    return response(true, null, err.message || 'Failed to delete resource');
  }
};
