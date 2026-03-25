/**
 * Health & Error Handling API Tests
 * Validates system heartbeats, connectivity status, and global exception handling resilience.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Health & Error Handling', function () {
  /**
   * Health Check Tests
   */
  it('should return 200 for health check', async function () {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal('Health OK');
  });

  /**
   * Error Handling Tests
   */
  it('should return 404 for unknown route', async function () {
    const res = await request(app).get('/api/v1/unknown');
    expect(res.statusCode).to.equal(404);
    expect(res.body.success).to.be.false;
    expect(res.body).to.have.property('message');
  });
});
