const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;

before(async function () {
  // Register and login a test user
  const user = {
    name: "Test User",
    email: "testuser+attendance@example.com",
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

describe("Attendance Service & API", function () {
  this.timeout(10000);
  let attendanceId;
  let studentId;
  const studentData = {
    name: "Attendance Student",
    email: `attendstudent+${Date.now()}@example.com`,
    rollNumber: `A${Date.now()}`,
    department: "Computer Science",
    year: 2,
  };

  before(async function () {
    // Create a student for attendance
    const res = await request(app)
      .post("/api/v1/students")
      .set("Authorization", `Bearer ${token}`)
      .send(studentData);
    studentId = res.body.data && res.body.data._id;
  });

  it("should mark attendance for a student", async function () {
    const res = await request(app)
      .post("/api/v1/attendance")
      .set("Authorization", `Bearer ${token}`)
      .send({ student: studentId, date: new Date(), status: "present" });
    expect(res.statusCode).to.equal(201);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id");
    attendanceId = res.body.data._id;
  });

  it("should fetch all attendance records", async function () {
    const res = await request(app)
      .get("/api/v1/attendance")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fetch attendance by student ID", async function () {
    const res = await request(app)
      .get(`/api/v1/attendance/student/${studentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.be.an("array");
  });
});
