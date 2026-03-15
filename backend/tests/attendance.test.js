const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;
let studentId;
let attendanceId;

before(async function () {
  this.timeout(20000);

  const user = {
    name: "Test User",
    email: `testuser+attendance+${Date.now()}@example.com`,
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

  expect(loginRes.statusCode).to.equal(200);
  expect(loginRes.body.data).to.have.property("token");

  token = loginRes.body.data.token;
});

describe("Attendance API", function () {
  const studentData = {
    name: "Attendance Student",
    email: `attendstudent+${Date.now()}@example.com`,
    rollNumber: `A${Date.now()}`,
    department: "Computer Science",
    year: 2,
  };

  before(async function () {
    const res = await request(app)
      .post("/api/v1/students")
      .set("Authorization", `Bearer ${token}`)
      .send(studentData);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;

    studentId = res.body.data._id;
  });

  it("should mark attendance for a student", async function () {
    const attendanceData = {
      student: studentId,
      date: new Date().toISOString(),
      status: "present"
    };
    const res = await request(app)
      .post("/api/v1/attendance")
      .set("Authorization", `Bearer ${token}`)
      .send(attendanceData);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property("_id");

    attendanceId = res.body.data._id;
  });

  it("should fetch all attendance records", async function () {
    const res = await request(app)
      .get("/api/v1/attendance")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fetch attendance by student ID", async function () {
    const res = await request(app)
      .get(`/api/v1/attendance/student/${studentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fail without authentication", async function () {
    const res = await request(app).get("/api/v1/attendance");

    expect(res.statusCode).to.equal(401);
  });
});
