/**
 * Notification API Tests
 * ------------------------------------------------------------------
 * Tests for automated system alerts and user notification delivery.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

let token;

before(async function () {
  this.timeout(20000);

  const user = {
    name: 'Notify User',
    email: `notify+${Date.now()}@example.com`,
    password: 'testpass123',
    role: 'student',
  };

  await request(app).post('/api/v1/auth/register').send(user);
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: user.email,
    password: user.password,
  });

  token = loginRes.body.data.token;
});

describe('Notification API', function () {
  it('should fetch notifications', async function () {
    const res = await request(app)
      .get('/api/v1/notifications')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should fetch unread notifications', async function () {
    const res = await request(app)
      .get('/api/v1/notifications/unread')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should mark all as read', async function () {
    const res = await request(app)
      .patch('/api/v1/notifications/mark-all-read')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
  });
});
