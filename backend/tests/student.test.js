/**
 * Student API Tests
 * Validates student profile registration, enrollment status, and academic record management.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

let token;
let studentId;

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

  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: adminEmail,
    password: adminPassword,
  });

  token = loginRes.body.data.token;
});

describe('Student API', function () {
  const studentData = {
    name: 'Test Student',
    email: `student+${Date.now()}@example.com`,
    rollNumber: `S${Date.now()}`,
    department: 'Computer Science',
    year: 2,
  };

  it('should create a new student', async function () {
    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${token}`)
      .send(studentData);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('_id');

    studentId = res.body.data._id;
  });

  it('should fetch all students', async function () {
    const res = await request(app)
      .get('/api/v1/students')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should fetch a student by ID', async function () {
    const res = await request(app)
      .get(`/api/v1/students/${studentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(studentId);
  });

  it('should update a student', async function () {
    const res = await request(app)
      .put(`/api/v1/students/${studentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Student' });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.name).to.equal('Updated Student');
  });

  it('should delete a student', async function () {
    const res = await request(app)
      .delete(`/api/v1/students/${studentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail without authentication', async function () {
    const res = await request(app).get('/api/v1/students');
    expect(res.statusCode).to.equal(401);
  });
});
