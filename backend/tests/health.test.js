const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

describe("Health & Error Handling", function () {
  it("should return 404 for unknown route", async function () {
    const res = await request(app).get("/api/v1/unknown");

    expect(res.statusCode).to.equal(404);
    expect(res.body).to.be.an("object");

    // Strict response validation
    expect(res.body).to.have.property("success", false);
    expect(res.body).to.have.property("message");
  });
});
