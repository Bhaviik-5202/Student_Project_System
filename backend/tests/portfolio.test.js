const request = require("supertest");
const app = require("../server");

describe("Portfolio Service & API", () => {
  let studentId;
  let portfolioId;
  const studentData = {
    name: "Portfolio Student",
    email: "portfoliostudent@example.com",
    rollNo: "P123",
  };

  beforeAll(async () => {
    // Create a student for the portfolio
    const res = await request(app).post("/api/v1/students").send(studentData);
    studentId = res.body.data._id;
  });

  it("should create a new portfolio", async () => {
    const res = await request(app).post("/api/v1/portfolios").send({
      student: studentId,
      projects: [],
      skills: [],
      badges: [],
      transcriptUrl: "",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
    portfolioId = res.body.data._id;
  });

  it("should fetch a portfolio by student", async () => {
    const res = await request(app).get(
      `/api/v1/portfolios/student/${studentId}`,
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("student", studentId);
  });

  it("should update a portfolio", async () => {
    const res = await request(app)
      .put(`/api/v1/portfolios/${portfolioId}`)
      .send({ skills: ["Node.js"] });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.skills).toContain("Node.js");
  });
});
