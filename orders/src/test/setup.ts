import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper");

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "fshgjhkhjsvf";

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a jwt  {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object
  const session = { jwt: token };

  // turn that sesion into json
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

// return [`session=${base64}`];
