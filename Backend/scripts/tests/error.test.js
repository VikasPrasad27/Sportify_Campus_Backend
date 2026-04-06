const request = require("supertest");
const app = require("../app");

describe("Error Handling", () => {

  it("should fail with invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@gmail.com",
        password: "wrong"
      });

    expect(res.statusCode).toBe(401);
  });

});