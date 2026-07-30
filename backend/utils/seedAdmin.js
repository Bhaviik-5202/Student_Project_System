const User = require('../models/user.model');
const Staff = require('../models/staff.model');
const Student = require('../models/student.model');
const logger = require('./logger');

/**
 * Super Admin Seeding & Protection Utility
 * Ensures the existence of exactly ONE permanent Super Admin user in the system.
 * Credentials are read dynamically from environment variables (SUPER_ADMIN_EMAIL & SUPER_ADMIN_PASSWORD).
 */
const seedAdmin = async () => {
  const adminEmail = (
    process.env.SUPER_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    'er.bhavik5202@gmail.com'
  )
    .toLowerCase()
    .trim();
  const adminPassword =
    process.env.SUPER_ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    'Bhaviik@5202StuProject01';
  const adminName = process.env.ADMIN_NAME || 'Bhaviik Parmar';

  try {
    let superAdmin = await User.findOne({ email: adminEmail }).select(
      '+password'
    );

    if (!superAdmin) {
      logger.info('Seeding Single Super Admin user...');
      superAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        status: 'active',
      });
      logger.success('Single Super Admin user created successfully', {
        name: adminName,
        email: adminEmail,
        role: 'admin',
      });
    } else {
      let isUpdated = false;
      if (superAdmin.name !== adminName) {
        superAdmin.name = adminName;
        isUpdated = true;
      }
      if (superAdmin.role !== 'admin') {
        superAdmin.role = 'admin';
        isUpdated = true;
      }
      if (superAdmin.status !== 'active') {
        superAdmin.status = 'active';
        isUpdated = true;
      }
      const isMatch = await superAdmin.comparePassword(adminPassword);
      if (!isMatch) {
        superAdmin.password = adminPassword;
        isUpdated = true;
      }
      if (isUpdated) {
        await superAdmin.save();
        logger.info('Updated Super Admin credentials & active status');
      } else {
        logger.info('Super Admin user already configured cleanly');
      }
    }

    // Enforce Singleton Rule: Demote any other user with role 'admin'
    const extraAdmins = await User.find({
      role: 'admin',
      email: { $ne: adminEmail },
    });

    if (extraAdmins.length > 0) {
      logger.warn(
        `Found ${extraAdmins.length} unauthorized admin accounts. Downgrading to faculty...`
      );
      for (const extraAdmin of extraAdmins) {
        extraAdmin.role = 'faculty';
        await extraAdmin.save();
        logger.info(`Downgraded unauthorized admin: ${extraAdmin.email}`);
      }
    }

    // Ensure Super Admin is never present in Staff collection
    await Staff.deleteMany({ email: adminEmail });

    if (process.env.PURGE_DUMMY_USERS === 'true') {
      await User.deleteMany({ email: { $ne: adminEmail } });
      await Staff.deleteMany({ email: { $ne: adminEmail } });
      await Student.deleteMany({});
      logger.info('Purged all dummy user, staff, and student accounts');
    }
  } catch (error) {
    logger.error('Error seeding Single Super Admin', { err: error });
  }
};

module.exports = seedAdmin;
