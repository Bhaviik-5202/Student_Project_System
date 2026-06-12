const User = require('../models/user.model');

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
    console.log(
      'ℹ️ Admin seed skipped: set ADMIN_EMAIL and ADMIN_PASSWORD in .env to bootstrap an admin account'
    );
    return;
  }

  try {
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('🌱 Seeding master admin user...');
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('✅ Master admin user created successfully');
    } else {
      console.log('ℹ️ Master admin user already exists');

      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Existing user promoted to admin role');
      }
    }
  } catch (error) {
    console.error('❌ Error seeding master admin:', error.message);
  }
};

module.exports = seedAdmin;
