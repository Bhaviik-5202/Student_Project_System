const request = require("supertest");
const app = require("../server");

describe("Student Service & API", () => {
  let studentId;
  const studentData = {
    name: "Test Student",
    email: "student@example.com",
    rollNo: "S123",
  };

  it("should create a new student", async () => {
    const res = await request(app).post("/api/v1/students").send(studentData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    studentId = res.body.data._id;
  });

  it("should fetch all students", async () => {
    const res = await request(app).get("/api/v1/students");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch a student by ID", async () => {
    const res = await request(app).get(`/api/v1/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", studentId);
  });

  it("should update a student", async () => {
    const res = await request(app)
      .put(`/api/v1/students/${studentId}`)
      .send({ name: "Updated Student" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Student");
  });

  it("should delete a student", async () => {
    const res = await request(app).delete(`/api/v1/students/${studentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
