const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

let token;

before(async function () {
  // Register and login a test user
  const user = {
    name: "Test User",
    email: "testuser+user@example.com",
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

describe("User Service & API", function () {
  this.timeout(10000);
  let userId;
  const userData = {
    name: "Test User",
    email: "testuser@example.com",
    password: "testpass",
    role: "faculty",
  };

  it("should create a new user", async function () {
    const res = await request(app)
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)
      .send(userData);
    expect(res.statusCode).to.equal(201);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id");
    userId = res.body.data._id;
  });

  it("should fetch all users", async function () {
    const res = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.be.an("array");
  });

  it("should fetch a user by ID", async function () {
    const res = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data).to.have.property("_id", userId);
  });

  it("should update a user", async function () {
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated User" });
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
    expect(res.body.data.name).to.equal("Updated User");
  });

  it("should delete a user", async function () {
    const res = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.success || res.body.error === false).to.be.true;
  });
});
