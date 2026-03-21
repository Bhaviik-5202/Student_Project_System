const userRepository = require("../repositories/user.repository");
const auditLogService = require("./auditlog.service");

/**
 * Admin Service
 * Handles administrative tasks like permissions, backups, and batch operations.
 */
const adminService = {
  /**
   * Get all available system roles
   */
  getRoles: async () => {
    try {
      const roles = [
        { id: "1", name: "Admin", description: "Full system access", users: await userRepository.count({ role: "admin" }) },
        { id: "2", name: "Faculty", description: "Project and student management", users: await userRepository.count({ role: "faculty" }) },
        { id: "3", name: "Student", description: "Project participation and submissions", users: await userRepository.count({ role: "student" }) }
      ];
      return { success: true, data: roles };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get permissions for a specific role
   */
  getPermissions: async (roleName) => {
    try {
      // In a real app, this would be in a Role/Permission model
      const permissions = {
        admin: {
          userManagement: true,
          projectManagement: true,
          courseManagement: true,
          systemSettings: true,
          reporting: true,
          backupRestore: true
        },
        faculty: {
          userManagement: false,
          projectManagement: true,
          courseManagement: true,
          systemSettings: false,
          reporting: true,
          backupRestore: false
        },
        student: {
          userManagement: false,
          projectManagement: true,
          courseManagement: false,
          systemSettings: false,
          reporting: false,
          backupRestore: false
        }
      };
      return { success: true, data: permissions[roleName.toLowerCase()] || {} };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Get system backups
   */
  getBackups: async () => {
    try {
      // Simulated backups list
      const backups = [
        { id: "b1", name: "Full_Backup_20260320", type: "Full", size: "156MB", date: "2026-03-20 02:00 AM" },
        { id: "b2", name: "Incremental_Backup_20260321", type: "Incremental", size: "12MB", date: "2026-03-21 02:00 AM" }
      ];
      return { success: true, data: backups };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Process a batch operation
   */
  processBatchOperation: async (operationData) => {
    const { operation, selectedUsers, message } = operationData;
    try {
      // Logic for sending emails/notifications would go here
      // For now, we'll log it in the Audit Log
      await auditLogService.create({
        action: `Batch ${operation}`,
        description: `${operation} sent to ${selectedUsers.length} users`,
        status: "Success",
        userId: operationData.adminId // Need to pass this from controller
      });

      return { success: true, message: `${operation} operation completed for ${selectedUsers.length} users` };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

module.exports = adminService;
