/**
 * Resource API Tests
 * Validates the management of academic assets, including documents, templates, and multimedia content.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

let token;
let resourceId;

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

describe('Resource API', function () {
  const resourceData = {
    title: 'Test Resource',
    description: 'A test resource',
    type: 'document',
    url: 'https://example.com/test',
  };

  it('should create a new resource', async function () {
    const res = await request(app)
      .post('/api/v1/resources')
      .set('Authorization', `Bearer ${token}`)
      .send(resourceData);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('_id');

    resourceId = res.body.data._id;
  });

  it('should fetch all resources', async function () {
    const res = await request(app)
      .get('/api/v1/resources')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should fetch resource by ID', async function () {
    const res = await request(app)
      .get(`/api/v1/resources/${resourceId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(resourceId);
  });

  it('should delete a resource', async function () {
    const res = await request(app)
      .delete(`/api/v1/resources/${resourceId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail without authentication', async function () {
    const res = await request(app).get('/api/v1/resources');
    expect(res.statusCode).to.equal(401);
  });
});
