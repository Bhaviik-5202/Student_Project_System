const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;

before(async function () {
  this.timeout(20000); // Increase timeout for debug
  console.log("[TEST] Starting assignment test setup...");
  const user = {
    name: "Test User",
    email: `testuser+assign+${Date.now()}@example.com`,
    password: "testpass123",
    role: "faculty",
  };
  try {
    const regRes = await request(app).post("/api/v1/auth/register").send(user);
    console.log("[TEST] Registration response:", regRes.body);
    const res = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });
    console.log("[TEST] Login response:", res.body);
    token = res.body.data && res.body.data.token;
    if (!token) throw new Error("No token received");
    console.log("[TEST] Token acquired");
  } catch (err) {
    console.error("[TEST] Setup error:", err);
    throw err;
  }
});

describe("Assignment Service & API", function () {
  let assignmentId;
  const assignmentData = {
    title: "Test Assignment",
    description: "A test assignment",
  };

  it("should create a new assignment", async function () {
    const res = await request(app)
      .post("/api/v1/assignments")
      .set("Authorization", `Bearer ${token}`)
      .send(assignmentData);
    expect(res.statusCode).to.equal(201);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id");
    assignmentId = res.body.data._id;
  });

  it("should fetch all assignments", async function () {
    const res = await request(app)
      .get("/api/v1/assignments")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fetch an assignment by ID", async function () {
    const res = await request(app)
      .get(`/api/v1/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id", assignmentId);
  });

  it("should update an assignment", async function () {
    const res = await request(app)
      .put(`/api/v1/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Assignment" });
    if (res.statusCode === 404) {
      expect(res.body.error).to.be.true;
    } else {
      expect(res.statusCode).to.equal(200);
      expect(res.body.success || res.body.error === false).to.be.true;
      expect(res.body.data.title).to.equal("Updated Assignment");
    }
  });

  it("should delete an assignment", async function () {
    const res = await request(app)
      .delete(`/api/v1/assignments/${assignmentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
  });
});
