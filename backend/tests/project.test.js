/**
 * Project API Tests
 * Validates the core project life cycle, including creation, retrieval, and administrative updates.
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

let token;
let projectId;

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

describe('Project API', function () {
  const projectData = {
    title: 'Test Project',
    description: 'A test project',
    type: 'Software Development',
  };

  it('should create a new project', async function () {
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send(projectData);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property('_id');

    projectId = res.body.data._id;
  });

  it('should fetch all projects', async function () {
    const res = await request(app)
      .get('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an('array');
  });

  it('should fetch a project by ID', async function () {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(projectId);
  });

  it('should update a project', async function () {
    const res = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Project', type: 'Software Development' });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.title).to.equal('Updated Project');
  });

  it('should delete a project', async function () {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('should fail without authentication', async function () {
    const res = await request(app).get('/api/v1/projects');
    expect(res.statusCode).to.equal(401);
  });
});
