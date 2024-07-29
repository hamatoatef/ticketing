import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up...");

  // check if kwt key exists
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL must be defined");
  }

  try {
    mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("connection established");
    });
  } catch (e) {
    console.log(e);
  }
  app.listen(3000, () => {
    console.log("listening on port 3000 !!");
  });
};

start();
