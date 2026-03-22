/**
 * Test Environment Setup
 * ------------------------------------------------------------------
 * Global configuration for the test suite, including database
 * connection management and timing settings.
 */

const app = require('../server');
const mongoose = require('mongoose');

before(async function () {
  this.timeout(180000);
  console.log('Waiting for MongoDB Memory Server to connect...');
  // Wait until mongoose is connected
  while (mongoose.connection.readyState !== 1) {
    await new Promise((res) => setTimeout(res, 100));
  }
  console.log('MongoDB is connected for tests.');
});

after(async function () {
  console.log('Disconnecting MongoDB...');
  await mongoose.disconnect();
});
