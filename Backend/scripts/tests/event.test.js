const request = require("supertest");
const app = require("../../index");

describe("Event API", () => {

  it("should fetch all events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.statusCode).toBe(200);
  });

  it("should fetch upcoming events", async () => {
    const res = await request(app).get("/api/events/upcoming");
    expect(res.statusCode).toBe(200);
  });

});