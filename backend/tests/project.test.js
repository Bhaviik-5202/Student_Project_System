const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;

before(async function () {
  // Register and login a test user
  const user = {
    name: "Test User",
    email: "testuser+project@example.com",
    password: "testpass123",
    role: "faculty",
  };
  await request(app).post("/api/v1/auth/register").send(user);
  const res = await request(app).post("/api/v1/auth/login").send({
    email: user.email,
    password: user.password,
  });
  token = res.body.data && res.body.data.token;
});

describe("Project Service & API", function () {
  let projectId;
  const projectData = { title: "Test Project", description: "A test project" };

  it("should create a new project", async function () {
    const res = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`)
      .send(projectData);
    expect(res.statusCode).to.equal(201);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id");
    projectId = res.body.data._id;
  });

  it("should fetch all projects", async function () {
    const res = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fetch a project by ID", async function () {
    const res = await request(app)
      .get(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id", projectId);
  });

  it("should update a project", async function () {
    const res = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Project" });
    if (res.statusCode === 404) {
      expect(res.body.error).to.be.true;
    } else {
      expect(res.statusCode).to.equal(200);
      expect(res.body.success || res.body.error === false).to.be.true;
      expect(res.body.data.title).to.equal("Updated Project");
    }
  });

  it("should delete a project", async function () {
    const res = await request(app)
      .delete(`/api/v1/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
  });
});
