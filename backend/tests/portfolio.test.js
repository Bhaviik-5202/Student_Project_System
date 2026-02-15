const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;
let studentId;

before(async function () {
  // Register and login a test user
  const user = {
    name: "Test User",
    email: "testuser+portfolio@example.com",
    password: "testpass123",
    role: "faculty",
  };
  await request(app).post("/api/v1/auth/register").send(user);
  const res = await request(app).post("/api/v1/auth/login").send({
    email: user.email,
    password: user.password,
  });
  token = res.body.data && res.body.data.token;
  // Create a student for the portfolio
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
  studentId = studentRes.body.data && studentRes.body.data._id;
});

describe("Portfolio Service & API", function () {
  this.timeout(10000);
  let portfolioId;

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
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id");
    portfolioId = res.body.data._id;
  });

  it("should fetch a portfolio by student", async function () {
    const res = await request(app)
      .get(`/api/v1/portfolios/student/${studentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("student");
    expect(res.body.data.student).to.equal(studentId);
  });

  it("should update a portfolio", async function () {
    const res = await request(app)
      .put(`/api/v1/portfolios/${portfolioId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ skills: ["Node.js"] });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data.skills).to.include("Node.js");
  });
});
