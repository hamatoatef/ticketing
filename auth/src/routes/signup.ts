import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@hamatotickets/common";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUSer = await User.findOne({ email });

    if (existingUSer) {
      throw new BadRequestError("Email already in use");
    }

    const user = User.build({
      email,
      password,
    });

    await user.save();

    // Gererate JWt
    const userjwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userjwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUp };
