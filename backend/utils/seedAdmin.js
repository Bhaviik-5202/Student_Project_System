const User = require('../models/user.model');

/**
 * Ensures the master administrator user exists in the database.
 * If not, it creates a new admin user with the specified credentials.
 */
const seedAdmin = async () => {
  try {
    const adminEmail = 'er.bhavik5202@gmail.com';
    const adminPassword = 'Bhaviik@5202';
    const adminName = 'Bhavik Parmar';

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

      // Ensure the existing user has the correct role
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
