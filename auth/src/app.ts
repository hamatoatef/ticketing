import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { siginInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUp } from "./routes/signup";
import { errorHandler, NotFoundError } from "@hamatotickets/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(siginInRouter);
app.use(signOutRouter);
app.use(signUp);

app.all("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
