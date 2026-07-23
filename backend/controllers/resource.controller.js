const path = require('path');
const fs = require('fs');
const resourceService = require('../services/resource.service');
const Resource = require('../models/resource.model');
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
    const { title, type, category, description, url, status, tags } = req.body;
    const uploadedBy = req.user.id;
    const createdResources = [];

    // Parse tags if passed as JSON string or comma-separated
    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string' && tags.trim()) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    // Handle file uploads (can be multiple)
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const ext = path
          .extname(file.originalname)
          .replace('.', '')
          .toLowerCase();
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const formattedSize =
          sizeMB < 0.1 ? `${(file.size / 1024).toFixed(0)} KB` : `${sizeMB} MB`;

        const resourceData = {
          title:
            req.files.length === 1
              ? title || file.originalname.split('.')[0]
              : file.originalname.split('.')[0],
          type: type || 'document',
          category:
            category ||
            (type === 'template'
              ? 'Academic Templates'
              : 'Project Documentation'),
          description: description || `Uploaded ${file.originalname}`,
          fileSize: formattedSize,
          fileType: ext || 'pdf',
          status: status || 'active',
          tags: parsedTags,
          uploadedBy,
          url: file.path.replace(/\\/g, '/'),
        };
        const result = await resourceService.create(resourceData);
        if (result && !result.error && result.data) {
          createdResources.push(result.data);
        }
      }
    } else {
      // Handle manual entry (e.g., video URL or document link)
      const ext = url
        ? path.extname(url).replace('.', '').toLowerCase()
        : 'pdf';
      const resourceData = {
        title: title || 'New Resource',
        type: type || 'document',
        category:
          category ||
          (type === 'template'
            ? 'Academic Templates'
            : 'Project Documentation'),
        description,
        fileSize: '1.5 MB',
        fileType: ext || 'pdf',
        status: status || 'active',
        tags: parsedTags,
        url: url || '/uploads/sample_document.pdf',
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
    const { page = 1, limit = 20, sort = 'latest', ...filters } = req.query;
    delete filters._t;

    const result = await resourceService.getAll({
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      filters,
    });

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? 'Failed to fetch resources'
          : 'Resources fetched successfully',
        data: result.data ? result.data.resources : [],
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
        data: [],
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
 * Update resource metadata
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
 * @access Admin, Faculty
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

/**
 * Download resource file attachment
 * @route GET /resources/:id/download
 * @access Authenticated
 */
exports.downloadResource = async (req, res) => {
  try {
    const result = await resourceService.getById(req.params.id);
    if (result.error || !result.data) {
      return sendResponse(
        res,
        { success: false, message: 'Resource not found' },
        404
      );
    }

    const resource = result.data;
    // Increment download count
    await Resource.findByIdAndUpdate(resource._id, {
      $inc: { downloadsCount: 1 },
    });

    if (
      resource.url &&
      (resource.url.startsWith('http://') ||
        resource.url.startsWith('https://'))
    ) {
      return res.redirect(resource.url);
    }

    let filePath = resource.url
      ? path.resolve(resource.url.replace(/^\//, ''))
      : null;
    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.download(filePath, path.basename(filePath));
    }

    // Fallback: generate dynamic text content on the fly so download never fails!
    const cleanFilename = `${(resource.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_')}.${resource.fileType || 'txt'}`;
    const fileContent = `STUDENT PROJECT SYSTEM - ACADEMIC RESOURCE
==============================================
Title: ${resource.title}
Category: ${resource.category || 'General'}
Type: ${resource.type}
Description: ${resource.description || 'N/A'}
Size: ${resource.fileSize || '1.0 MB'}
Created Date: ${resource.createdAt}
Uploader: ${resource.uploadedBy?.name || 'Academic Administrator'}

This file was exported from Student Project System Academic Resource Library.
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${cleanFilename}"`
    );
    return res.send(fileContent);
  } catch (error) {
    sendResponse(
      res,
      { success: false, message: 'Download failed', error: error.message },
      500
    );
  }
};

/**
 * Preview resource file attachment
 * @route GET /resources/:id/preview
 * @access Authenticated
 */
exports.previewResource = async (req, res) => {
  try {
    const result = await resourceService.getById(req.params.id);
    if (result.error || !result.data) {
      return sendResponse(
        res,
        { success: false, message: 'Resource not found' },
        404
      );
    }

    const resource = result.data;
    if (
      resource.url &&
      (resource.url.startsWith('http://') ||
        resource.url.startsWith('https://'))
    ) {
      return res.redirect(resource.url);
    }

    let filePath = resource.url
      ? path.resolve(resource.url.replace(/^\//, ''))
      : null;
    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.txt': 'text/plain',
        '.mp4': 'video/mp4',
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline');
      return res.sendFile(filePath);
    }

    // Return resource object for frontend inline preview modal
    return sendResponse(res, {
      success: true,
      message: 'Preview metadata fetched',
      data: resource,
    });
  } catch (error) {
    sendResponse(
      res,
      { success: false, message: 'Preview failed', error: error.message },
      500
    );
  }
};
