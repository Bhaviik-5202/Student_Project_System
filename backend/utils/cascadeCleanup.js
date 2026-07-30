const Notification = require('../models/notification.model');
const Meeting = require('../models/meeting.model');
const Project = require('../models/project.model');
const Activity = require('../models/activity.model');
const logger = require('./logger');

/**
 * Performs cascade deletion cleanups across linked models when a User/Staff/Student is removed.
 * @param {string|Object} userId - User ID or document ID
 * @param {string} [email] - User email
 */
const cascadeUserCleanup = async (userId, email) => {
  try {
    const userIdsToClean = [];
    if (userId) userIdsToClean.push(userId);

    // 1. Delete all notifications associated with the user
    if (userIdsToClean.length > 0) {
      await Notification.deleteMany({ user: { $in: userIdsToClean } });
    }

    // 2. Clean up meetings created by or assigned to user
    if (userIdsToClean.length > 0) {
      await Meeting.deleteMany({
        $or: [
          { organizer: { $in: userIdsToClean } },
          { participants: { $in: userIdsToClean } },
        ],
      });
    }

    // 3. Remove user references from projects (as guide, leader, or member)
    if (userIdsToClean.length > 0) {
      await Project.updateMany(
        { guide: { $in: userIdsToClean } },
        { $unset: { guide: '' }, status: 'Pending Guide Assignment' }
      );
      await Project.updateMany(
        { members: { $in: userIdsToClean } },
        { $pull: { members: { $in: userIdsToClean } } }
      );
      await Project.updateMany(
        { leader: { $in: userIdsToClean } },
        { $unset: { leader: '' } }
      );
    }

    // 4. Delete user activities
    if (userIdsToClean.length > 0) {
      await Activity.deleteMany({ user: { $in: userIdsToClean } });
    }

    logger.info('Cascade user cleanup completed successfully', { userId, email });
  } catch (error) {
    logger.error('Error during cascade user cleanup', { error: error.message });
  }
};

module.exports = cascadeUserCleanup;
