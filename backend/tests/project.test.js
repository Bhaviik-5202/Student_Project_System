const request = require("supertest");
const app = require("../server");

describe("Project Service & API", () => {
  let projectId;
  const projectData = { title: "Test Project", description: "A test project" };

  it("should create a new project", async () => {
    const res = await request(app).post("/api/v1/projects").send(projectData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    projectId = res.body.data._id;
  });

  it("should fetch all projects", async () => {
    const res = await request(app).get("/api/v1/projects");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should fetch a project by ID", async () => {
    const res = await request(app).get(`/api/v1/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id", projectId);
  });

  it("should update a project", async () => {
    const res = await request(app)
      .put(`/api/v1/projects/${projectId}`)
      .send({ title: "Updated Project" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Project");
  });

  it("should delete a project", async () => {
    const res = await request(app).delete(`/api/v1/projects/${projectId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
