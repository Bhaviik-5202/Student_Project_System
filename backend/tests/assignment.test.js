/**
 * Assignment API Tests
 * ------------------------------------------------------------------
 * Tests for student assignment distribution and management.
 */

const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;
let assignmentId;

before(async function () {
  this.timeout(20000);

  const user = {
    name: "Test User",
    email: `testuser+assign+${Date.now()}@example.com`,
    password: "testpass123",
    role: "faculty",
  };

  // Register
  await request(app).post("/api/v1/auth/register").send(user);

  // Login
  const loginRes = await request(app).post("/api/v1/auth/login").send({
    email: user.email,
    password: user.password,
  });

  token = loginRes.body.data.token;
});

describe("Assignment API", function () {
  const assignmentData = {
    title: "Test Assignment",
    description: "A test assignment",
    course: "507f1f77bcf86cd799439011",
  };

  it("should create a new assignment", async function () {
    const res = await request(app)
      .post("/api/v1/assignments")
      .set("Authorization", `Bearer ${token}`)
      .send(assignmentData);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property("_id");

    assignmentId = res.body.data._id;
  });

  it("should fetch all assignments", async function () {
    const res = await request(app)
      .get("/api/v1/assignments")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fetch an assignment by ID", async function () {
    const res = await request(app)
      .get(`/api/v1/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data._id).to.equal(assignmentId);
  });

  it("should update an assignment", async function () {
    const res = await request(app)
      .put(`/api/v1/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Assignment" });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.title).to.equal("Updated Assignment");
  });

  it("should delete an assignment", async function () {
    const res = await request(app)
      .delete(`/api/v1/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it("should fail without authentication", async function () {
    const res = await request(app).get("/api/v1/assignments");
    expect(res.statusCode).to.equal(401);
  });
});
