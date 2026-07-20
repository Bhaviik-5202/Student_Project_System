#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('../config/db');
const User = require('../models/user.model');

const ADMIN_EMAIL = 'admin@local.test';
const ADMIN_PASSWORD = 'AdminPass123!';
const ADMIN_NAME = 'Local Admin';

(async () => {
  try {
    await connectDB();
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      existing.role = 'admin';
      existing.name = ADMIN_NAME;
      existing.status = 'active';
      existing.password = ADMIN_PASSWORD; // will be hashed
      await existing.save();
      console.log('Updated existing admin:', ADMIN_EMAIL);
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      });
      console.log('Created admin:', ADMIN_EMAIL);
    }
    console.log('Admin credentials:');
    console.log('  email:', ADMIN_EMAIL);
    console.log('  password:', ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    process.exit(1);
  }
})();
