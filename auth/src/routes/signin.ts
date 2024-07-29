import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@hamatotickets/common";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("password must supply a valid password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUSer = await User.findOne({ email });

    if (!existingUSer)
      throw new BadRequestError("there is no user with that email");

    const passwordMatch = await Password.compare(
      existingUSer.password,
      password
    );

    if (!passwordMatch)
      throw new BadRequestError("email or password is incorrect");

    // Gererate JWt
    const userjwt = jwt.sign(
      { id: existingUSer.id, email: existingUSer.email },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userjwt,
    };

    res.status(200).send(existingUSer);
  }
);

export { router as siginInRouter };
