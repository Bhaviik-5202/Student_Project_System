const User = require('../models/user.model');
const logger = require('./logger');

/**
 * Admin Seeding Utility
 * Ensures the existence of a master administrator user in the database for system bootstrapping.
 * Credentials are read from environment variables — never hardcode secrets in source.
 */
const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  if (!adminEmail || !adminPassword) {
    logger.info(
      'Admin seed skipped: set ADMIN_EMAIL and ADMIN_PASSWORD in .env to bootstrap an admin account'
    );
    return;
  }

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      logger.info('Seeding master admin user...');
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      logger.success('Master admin user created successfully', {
        name: adminName,
        email: adminEmail,
        role: 'admin',
      });
    } else {
      logger.info('Master admin user already exists — skipping seed');

      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        logger.success('Existing user promoted to admin role', {
          email: adminEmail,
        });
      }
    }
  } catch (error) {
    logger.error('Error seeding master admin', { err: error });
  }
};

module.exports = seedAdmin;
