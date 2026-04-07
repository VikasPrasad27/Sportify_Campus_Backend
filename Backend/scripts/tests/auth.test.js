const request = require("supertest");
const app = require("../../index");

describe("Auth API", () => {
  const uniqueId = Date.now();
  const testEmail = `testuser.${uniqueId}@example.com`;
  const testPassword = "123456";

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: testEmail,
        password: testPassword,
        rollNumber: `TEST${uniqueId}`,
        department: "Computer Science",
        year: 2,
        phone: "9876543210"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testEmail,
        password: testPassword
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});