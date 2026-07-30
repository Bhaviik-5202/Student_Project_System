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

  const adminEmail =
    process.env.SUPER_ADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    'er.bhavik5202@gmail.com';
  const adminPassword =
    process.env.SUPER_ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    'Bhaviik@5202StuProject01';

  // Login as Super Admin
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: adminEmail,
    password: adminPassword,
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

  it('should reject creating an admin user via POST /users with 403 Forbidden', async function () {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Malicious Admin',
        email: `badadmin+${Date.now()}@example.com`,
        password: 'password123',
        role: 'admin',
      });

    expect(res.statusCode).to.equal(403);
    expect(res.body.success).to.be.false;
  });

  it('should reject updating a user role to admin via PUT /users/:id with 403 Forbidden', async function () {
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' });

    expect(res.statusCode).to.equal(403);
    expect(res.body.success).to.be.false;
  });

  it('should reject updating or deleting Super Admin account with 403 Forbidden', async function () {
    const usersRes = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    const adminUser = (usersRes.body.data || []).find((u) => u.role === 'admin');

    if (adminUser) {
      const putRes = await request(app)
        .put(`/api/v1/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Hacked Name' });

      expect(putRes.statusCode).to.equal(403);
      expect(putRes.body.success).to.be.false;
      expect(putRes.body.message).to.equal(
        'Super Admin account is protected and cannot be modified.'
      );

      const delRes = await request(app)
        .delete(`/api/v1/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(delRes.statusCode).to.equal(403);
      expect(delRes.body.success).to.be.false;
      expect(delRes.body.message).to.equal(
        'Super Admin account is protected and cannot be modified.'
      );
    }
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
