const settingService = require("../services/setting.service");
const sendResponse = require("../utils/response");

/**
 * Create a new setting
 * @route POST /settings
 * @access Admin
 */
exports.createSetting = async (req, res) => {
  try {
    const result = await settingService.create(req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to create setting"
          : "Setting created successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 201,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get all settings
 * @route GET /settings
 * @access Admin
 */
exports.getAllSettings = async (req, res) => {
  try {
    const result = await settingService.getAll();

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to fetch settings"
          : "Settings fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 400 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Get a setting by ID
 * @route GET /settings/:id
 * @access Admin
 */
exports.getSettingById = async (req, res) => {
  try {
    const result = await settingService.getById(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Setting not found"
          : "Setting fetched successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Update a setting by ID
 * @route PUT /settings/:id
 * @access Admin
 */
exports.updateSetting = async (req, res) => {
  try {
    const result = await settingService.update(req.params.id, req.body);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to update setting"
          : "Setting updated successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};

/**
 * Delete a setting by ID
 * @route DELETE /settings/:id
 * @access Admin
 */
exports.deleteSetting = async (req, res) => {
  try {
    const result = await settingService.remove(req.params.id);

    sendResponse(
      res,
      {
        success: !result.error,
        message: result.error
          ? "Failed to delete setting"
          : "Setting deleted successfully",
        data: result.data || null,
        error: result.error || null,
      },
      result.error ? 404 : 200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: "Internal server error",
        data: null,
        error: error.message,
      },
      500,
    );
  }
};
