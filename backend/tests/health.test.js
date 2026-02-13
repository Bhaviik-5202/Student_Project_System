const request = require("supertest");
const app = require("../server");

describe("Health Check", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/api/v1/unknown");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
