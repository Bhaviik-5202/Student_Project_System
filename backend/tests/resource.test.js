const request = require("supertest");
const app = require("../server");

describe("Resource Service & API", () => {
  let resourceId;
  const resourceData = {
    title: "Test Resource",
    url: "http://example.com/resource.pdf",
    uploadedBy: null,
  };

  it("should create a new resource", async () => {
    // You may need to provide a valid uploadedBy user ID if required by your schema
    const res = await request(app).post("/api/v1/resources").send(resourceData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    resourceId = res.body.data._id;
  });

  it("should fetch all resources", async () => {
    const res = await request(app).get("/api/v1/resources");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch a resource by ID", async () => {
    const res = await request(app).get(`/api/v1/resources/${resourceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", resourceId);
  });

  it("should delete a resource", async () => {
    const res = await request(app).delete(`/api/v1/resources/${resourceId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
