const request = require("supertest");
const app = require("../app");

describe("Fixture Generation", () => {

  it("should generate round robin fixtures", async () => {
    const res = await request(app)
      .post("/api/fixtures/generate")
      .send({
        type: "round-robin",
        teams: ["A", "B", "C", "D"]
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.matches.length).toBeGreaterThan(0);
  });

  it("should generate knockout fixtures", async () => {
    const res = await request(app)
      .post("/api/fixtures/generate")
      .send({
        type: "knockout",
        teams: ["A", "B", "C", "D"]
      });

    expect(res.statusCode).toBe(200);
  });

});