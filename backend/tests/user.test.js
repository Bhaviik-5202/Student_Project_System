const request = require("supertest");
const app = require("../server");

describe("User Service & API", () => {
  let userId;
  const userData = {
    name: "Test User",
    email: "testuser@example.com",
    password: "testpass",
  };

  it("should create a new user", async () => {
    const res = await request(app).post("/api/v1/users").send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    userId = res.body.data._id;
  });

  it("should fetch all users", async () => {
    const res = await request(app).get("/api/v1/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch a user by ID", async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", userId);
  });

  it("should update a user", async () => {
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send({ name: "Updated User" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated User");
  });

  it("should delete a user", async () => {
    const res = await request(app).delete(`/api/v1/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
