import request from "supertest";
import { app } from "../../app";

it("fials when an email that does not exist", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@tests.com",
      password: "password",
    })
    .expect(400);
});

it("fials when an incorrect password ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "passwords",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentails ", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
