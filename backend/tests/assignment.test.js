const request = require("supertest");
const app = require("../server");

describe("Assignment Service & API", () => {
  let assignmentId;
  const assignmentData = {
    title: "Test Assignment",
    description: "A test assignment",
  };

  it("should create a new assignment", async () => {
    const res = await request(app)
      .post("/api/v1/assignments")
      .send(assignmentData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    assignmentId = res.body.data._id;
  });

  it("should fetch all assignments", async () => {
    const res = await request(app).get("/api/v1/assignments");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch an assignment by ID", async () => {
    const res = await request(app).get(`/api/v1/assignments/${assignmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", assignmentId);
  });

  it("should update an assignment", async () => {
    const res = await request(app)
      .put(`/api/v1/assignments/${assignmentId}`)
      .send({ title: "Updated Assignment" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Assignment");
  });

  it("should delete an assignment", async () => {
    const res = await request(app).delete(
      `/api/v1/assignments/${assignmentId}`,
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
