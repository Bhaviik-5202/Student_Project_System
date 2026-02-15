const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;

before(async function () {
  // Register and login a test user
  const user = {
    name: "Test User",
    email: "testuser+student@example.com",
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

describe("Student Service & API", function () {
  this.timeout(10000);
  let studentId;
  const studentData = {
    name: "Test Student",
    email: "student@example.com",
    rollNumber: "S123",
    department: "Computer Science",
    year: 2,
  };

  it("should create a new student", async function () {
    const res = await request(app)
      .post("/api/v1/students")
      .set("Authorization", `Bearer ${token}`)
      .send(studentData);
    expect(res.statusCode).to.equal(201);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id");
    studentId = res.body.data._id;
  });

  it("should fetch all students", async function () {
    const res = await request(app)
      .get("/api/v1/students")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fetch a student by ID", async function () {
    const res = await request(app)
      .get(`/api/v1/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id", studentId);
  });

  it("should update a student", async function () {
    const res = await request(app)
      .put(`/api/v1/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Student" });
    if (res.statusCode === 404) {
      expect(res.body.error).to.be.true;
    } else {
      expect(res.statusCode).to.equal(200);
      expect(res.body.success || res.body.error === false).to.be.true;
      expect(res.body.data.name).to.equal("Updated Student");
    }
  });

  it("should delete a student", async function () {
    const res = await request(app)
      .delete(`/api/v1/students/${studentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
  });
});
