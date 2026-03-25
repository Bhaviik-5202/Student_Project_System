/**
 * Activity API Tests
 * Validates the tracking and retrieval of user actions and system events.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

let token;

before(async function () {
  this.timeout(20000);

  const user = {
    name: 'Activity User',
    email: `activity+${Date.now()}@example.com`,
    password: 'testpass123',
    role: 'admin',
  };

  await request(app).post('/api/v1/auth/register').send(user);
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: user.email,
    password: user.password,
  });

  token = loginRes.body.data.token;
});

describe('Activity API', function () {
  it('should fetch activities', async function () {
    const res = await request(app)
      .get('/api/v1/activities')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should fail without token', async function () {
    const res = await request(app).get('/api/v1/activities');
    expect(res.statusCode).to.equal(401);
  });
});
