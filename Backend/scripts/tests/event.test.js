const request = require("supertest");
const app = require("../app");

describe("Event API", () => {

  it("should fetch all events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
  });

  it("should create event", async () => {
    const res = await request(app)
      .post("/api/events")
      .send({
        name: "Football Tournament",
        sport: "Football",
        type: "knockout"
      });

    expect(res.statusCode).toBe(201);
  });

});