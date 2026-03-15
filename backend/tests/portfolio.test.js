/**
 * Portfolio API Tests
 * ------------------------------------------------------------------
 * Tests for student professional portfolio and skill showcase management.
 */

const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;
let studentId;
let portfolioId;

before(async function () {
  this.timeout(20000);

  const user = {
    name: "Test User",
    email: `testuser+portfolio+${Date.now()}@example.com`,
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

  // Create student for portfolio tests
  const studentData = {
    name: "Portfolio Student",
    email: `portfoliostudent+${Date.now()}@example.com`,
    rollNumber: `P${Date.now()}`,
    department: "Computer Science",
    year: 2,
  };

  const studentRes = await request(app)
    .post("/api/v1/students")
    .set("Authorization", `Bearer ${token}`)
    .send(studentData);

  studentId = studentRes.body.data._id;
});

describe("Portfolio API", function () {
  it("should create a new portfolio", async function () {
    const res = await request(app)
      .post("/api/v1/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        student: studentId,
        projects: [],
        skills: [],
        badges: [],
        transcriptUrl: "",
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property("_id");

    portfolioId = res.body.data._id;
  });

  it("should fetch portfolio by student ID", async function () {
    const res = await request(app)
      .get(`/api/v1/portfolios/student/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    // Ensure student ID matches (handle both string and object if needed)
    const returnedStudentId =
      res.body.data.student._id || res.body.data.student;
    expect(returnedStudentId.toString()).to.equal(studentId.toString());
  });

  it("should update portfolio skills", async function () {
    const res = await request(app)
      .put(`/api/v1/portfolios/${portfolioId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ skills: ["Node.js"] });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data.skills).to.include("Node.js");
  });

  it("should fail without authentication", async function () {
    const res = await request(app).get(
      `/api/v1/portfolios/student/${studentId}`,
    );
    expect(res.statusCode).to.equal(401);
  });
});
