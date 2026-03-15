/**
 * Authentication API Tests
 * ------------------------------------------------------------------
 * Tests for user identity verification and sesión management.
 */

const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

describe("Authentication API", function () {
  const testUser = {
    name: "Auth Test User",
    email: `authtest+${Date.now()}@example.com`,
    password: "testpass123",
    role: "student",
  };

  /**
   * Registration Tests
   */
  it("should register a new user", async function () {
    const res = await request(app).post("/api/v1/auth/register").send(testUser);

    expect(res.statusCode).to.equal(201);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal("User registered successfully");
  });

  /**
   * Login Tests
   */
  it("should login an existing user", async function () {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.data).to.have.property("token");
  });

  it("should fail login with invalid credentials", async function () {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });

    expect(res.statusCode).to.equal(400); // Backend returns 400 for login failure
    expect(res.body.success).to.be.false;
  });

  /**
   * Password Management Tests
   */
  it("should request password reset", async function () {
    const res = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: testUser.email });

    expect(res.statusCode).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.equal("Password reset link sent to email");
  });

  it("should fail password reset with invalid token", async function () {
    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ token: "invalidtoken", password: "newpassword123" });

    expect(res.statusCode).to.equal(400);
    expect(res.body.success).to.be.false;
    expect(res.body.message).to.equal("Invalid or expired reset token");
  });
});
