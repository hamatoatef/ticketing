import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@example.com", password: "testpassword" })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  const cookie = response.get("Set-Cookie") as string[];
  expect(cookie[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});