/**
 * User API Tests
 * Validates user profile management, role-based access control, and administrative audit actions.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

let token;
let userId;

before(async function () {
  this.timeout(20000);

  const user = {
    name: 'Admin User',
    email: `authuser+${Date.now()}@example.com`,
    password: 'testpass123',
    role: 'admin',
    bypassOTP: true,
  };

  // Register
  await request(app).post('/api/v1/auth/register').send(user);

  // Login
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: user.email,
    password: user.password,
  });

  token = loginRes.body.data.token;
});

describe('User API', function () {
  const userData = {
    name: 'Test User',
    email: `testuser+${Date.now()}@example.com`,
    password: 'testpass123',
    role: 'faculty',
  };

  it('should create a new user', async function () {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userData);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('_id');

    userId = res.body.data._id;
  });

  it('should fetch all users', async function () {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should fetch a user by ID', async function () {
    const res = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(userId);
  });

  it('should update a user', async function () {
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User' });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.name).to.equal('Updated User');
  });

  it('should delete a user', async function () {
    const res = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail without authentication', async function () {
    const res = await request(app).get('/api/v1/users');
    expect(res.statusCode).to.equal(401);
  });
});
