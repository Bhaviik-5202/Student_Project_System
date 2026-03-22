const Setting = require('../models/setting.model');
const sendResponse = require('../utils/response');

/**
 * Setting Controller
 * Manages system-wide configurations, branding, and application settings.
 */

/**
 * Fetch all system settings
 * @route GET /settings
 * @access Admin
 */
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    sendResponse(
      res,
      {
        success: true,
        message: 'Settings fetched successfully',
        data: settings,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch settings',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Retrieve a specific setting by its ID
 * @route GET /settings/:id
 * @access Authenticated
 */
exports.getSettingById = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.id);
    sendResponse(
      res,
      {
        success: !!setting,
        message: setting ? 'Setting found' : 'Setting not found',
        data: setting,
        error: setting ? null : 'Invalid ID',
      },
      setting ? 200 : 404
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch setting',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Create a new system setting
 * @route POST /settings
 * @access Admin
 */
exports.createSetting = async (req, res) => {
  try {
    const setting = await Setting.create(req.body);
    sendResponse(
      res,
      {
        success: true,
        message: 'Setting created successfully',
        data: setting,
        error: null,
      },
      201
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to create setting',
        data: null,
        error: error.message,
      },
      400
    );
  }
};

/**
 * Retrieve a specific setting by its unique key
 * @route GET /settings/key/:key
 * @access Authenticated
 */
exports.getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    sendResponse(
      res,
      {
        success: !!setting,
        message: setting ? 'Setting found' : 'Setting not found',
        data: setting,
        error: setting ? null : 'Invalid key',
      },
      setting ? 200 : 404
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to fetch setting',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Update an existing system setting
 * @route PUT /settings/:id
 * @access Admin
 */
exports.updateSetting = async (req, res) => {
  try {
    const { key, value, description, category } = req.body;
    const setting = await Setting.findByIdAndUpdate(
      req.params.id,
      { key, value, description, category },
      { new: true, runValidators: true }
    );

    sendResponse(
      res,
      {
        success: !!setting,
        message: setting ? 'Setting updated successfully' : 'Setting not found',
        data: setting,
        error: setting ? null : 'Invalid ID',
      },
      setting ? 200 : 404
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to update setting',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Bulk update system settings
 * @route PUT /settings
 * @access Admin
 */
exports.bulkUpdateSettings = async (req, res) => {
  try {
    const settings = req.body; // Expecting { key1: val1, key2: val2, ... }
    const updatePromises = Object.entries(settings).map(([key, value]) =>
      Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true, runValidators: true }
      )
    );

    await Promise.all(updatePromises);

    sendResponse(
      res,
      {
        success: true,
        message: 'All settings updated successfully',
        data: settings,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to update settings',
        data: null,
        error: error.message,
      },
      500
    );
  }
};

/**
 * Reset all system settings to their factory defaults
 * @route POST /settings/reset
 * @access Admin
 */
exports.resetSettings = async (req, res) => {
  try {
    // Implement logical reset (e.g., clear table or apply defaults)
    // For now, returning success as placeholder
    sendResponse(
      res,
      {
        success: true,
        message: 'Settings reset to defaults',
        data: null,
        error: null,
      },
      200
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to reset settings',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
/**
 * Permanently delete a setting record
 * @route DELETE /settings/:id
 * @access Admin
 */
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findByIdAndDelete(req.params.id);
    sendResponse(
      res,
      {
        success: !!setting,
        message: setting ? 'Setting deleted' : 'Setting not found',
        data: null,
        error: setting ? null : 'Invalid ID',
      },
      setting ? 200 : 404
    );
  } catch (error) {
    sendResponse(
      res,
      {
        success: false,
        message: 'Failed to delete setting',
        data: null,
        error: error.message,
      },
      500
    );
  }
};
