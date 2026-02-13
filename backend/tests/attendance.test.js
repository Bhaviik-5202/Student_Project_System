const request = require("supertest");
const app = require("../server");

describe("Attendance Service & API", () => {
  let attendanceId;
  let studentId;
  const studentData = {
    name: "Attendance Student",
    email: "attendstudent@example.com",
    rollNo: "A123",
  };

  beforeAll(async () => {
    // Create a student for attendance
    const res = await request(app).post("/api/v1/students").send(studentData);
    studentId = res.body.data._id;
  });

  it("should mark attendance for a student", async () => {
    const res = await request(app)
      .post("/api/v1/attendance")
      .send({ student: studentId, date: new Date(), status: "present" });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    attendanceId = res.body.data._id;
  });

  it("should fetch all attendance records", async () => {
    const res = await request(app).get("/api/v1/attendance");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch attendance by student ID", async () => {
    const res = await request(app).get(
      `/api/v1/attendance/student/${studentId}`,
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
