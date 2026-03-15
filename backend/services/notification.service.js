const notificationRepository = require("../repositories/notification.repository");

/**
 * Standardized response helper for services
 * @param {boolean} error - Whether the operation failed
 * @param {any} data - The payload to return
 * @param {string} message - Descriptive status message
 * @returns {Object} { error, data, message }
 */
const response = (error, data, message) => ({ error, data, message });

/**
 * Dispatch a new system or user notification
 * @param {Object} data - Notification content and recipient details
 * @returns {Promise<Object>} Formatted service response with new notification data
 */
exports.create = async (data) => {
  try {
    const notification = await notificationRepository.create(data);
    return response(false, notification, "Notification created successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to create notification");
  }
};

/**
 * Fetch notifications for a specific user with pagination
 * @param {string} userId - Target user identifier
 * @param {number} page - Current page number
 * @param {number} limit - Max records per page
 * @returns {Promise<Object>} Formatted service response with notifications and metadata
 */
exports.getByUserId = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const filter = { user: userId };
    const [notifications, total] = await Promise.all([
      notificationRepository.findAll(filter, {
        skip,
        limit,
        sort: { createdAt: -1 },
      }),
      notificationRepository.count(filter),
    ]);
    return response(
      false,
      { notifications, total, page, pages: Math.ceil(total / limit) },
      "Notifications fetched successfully",
    );
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch notifications");
  }
};

/**
 * Retrieve only unread notifications for a specific user
 * @param {string} userId - Target user identifier
 * @returns {Promise<Object>} Formatted service response with unread notifications
 */
exports.getUnreadByUserId = async (userId) => {
  try {
    const notifications = await notificationRepository.findAll(
      { user: userId, read: false },
      { sort: { createdAt: -1 } },
    );
    return response(
      false,
      notifications,
      "Unread notifications fetched successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to fetch unread notifications",
    );
  }
};

/**
 * Mark a single notification as read by the user
 * @param {string} id - Notification identifier
 * @param {string} userId - Recipient user identifier (for authorization)
 * @returns {Promise<Object>} Formatted service response with updated notification
 */
exports.markAsRead = async (id, userId) => {
  try {
    const notification = await notificationRepository.update(id, {
      read: true,
    });
    if (!notification || notification.user.toString() !== userId) {
      return response(true, null, "Notification not found");
    }
    return response(
      false,
      notification,
      "Notification marked as read successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to mark notification as read",
    );
  }
};

/**
 * Mark every unread notification for a user as read
 * @param {string} userId - Target user identifier
 * @returns {Promise<Object>} Formatted service response
 */
exports.markAllAsRead = async (userId) => {
  try {
    const unread = await notificationRepository.findAll({
      user: userId,
      read: false,
    });
    await Promise.all(
      unread.map((n) => notificationRepository.update(n._id, { read: true })),
    );
    return response(
      false,
      null,
      "All notifications marked as read successfully",
    );
  } catch (err) {
    return response(
      true,
      null,
      err.message || "Failed to mark all notifications as read",
    );
  }
};

/**
 * Fetch a specific notification's details
 * @param {string} id - Notification identifier
 * @param {string} userId - Recipient user identifier (for authorization)
 * @returns {Promise<Object>} Formatted service response with notification data
 */
exports.getById = async (id, userId) => {
  try {
    const notification = await notificationRepository.findById(id);
    if (!notification || notification.user.toString() !== userId) {
      return response(true, null, "Notification not found");
    }
    return response(false, notification, "Notification fetched successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch notification");
  }
};

/**
 * Permanently remove a notification from the recipient's list
 * @param {string} id - Notification identifier
 * @param {string} userId - Recipient user identifier (for authorization)
 * @returns {Promise<Object>} Formatted service response
 */
exports.remove = async (id, userId) => {
  try {
    const notification = await notificationRepository.findById(id);
    if (!notification || notification.user.toString() !== userId) {
      return response(true, null, "Notification not found");
    }
    await notificationRepository.remove(id);
    return response(false, notification, "Notification deleted successfully");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete notification");
  }
};
