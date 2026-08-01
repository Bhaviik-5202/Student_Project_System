/**
 * Test Environment Setup
 * Configures the global test environment, including database connection pooling and timeout management.
 */

const connectDB = require('../config/db');
const mongoose = require('mongoose');

before(async function () {
  this.timeout(180000);
  console.log('Connecting to MongoDB for test suite...');
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  console.log('MongoDB is connected for tests.');
});

after(async function () {
  console.log('Disconnecting MongoDB...');
  await mongoose.disconnect();
});
