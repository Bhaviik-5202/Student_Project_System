const request = require("supertest");
const { expect } = require("chai");
const app = require("../server");

describe("Health Check", function () {
  it("should return 404 for unknown route", async function () {
    const res = await request(app).get("/api/v1/unknown");
    expect(res.statusCode).to.equal(404);
    expect(res.body.success === false || res.body.error === true).to.be.true;
  });
});
