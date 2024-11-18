import { Router } from "express";
import jwt from "jsonwebtoken";
import type { Schema } from "mongoose";
import { z } from "zod";
import type { Context } from "..";
import { backendConfig } from "../config";
import { hashPassword, isValidPassword } from "../lib/hashPassword";
import { validateMiddleware } from "../middlewares/validate";

const router = Router();

const signUpSchema = z.object({
  body: z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const signInSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const authRouter = ({ models: { UserModel } }: Context) => {
  router.post(
    "/sign-up",
    validateMiddleware(signUpSchema),
    async (req, res) => {
      const {
        firstName,
        lastName,
        email,
        password,
      }: z.infer<typeof signUpSchema>["body"] = req.body;

      const { passwordSalt, passwordHash } = await hashPassword(password);

      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        passwordHash,
        passwordSalt,
      });

      await newUser.save();

      res.sendStatus(201);
    }
  );
  router.post(
    "/sign-in",
    validateMiddleware(signInSchema),
    async (req, res) => {
      const { email, password }: z.infer<typeof signInSchema>["body"] =
        req.body;

      const user = await UserModel.findOne({
        email,
      });

      if (!user) {
        res.sendStatus(401);
        return;
      }

      if (
        !(await isValidPassword(user.passwordHash, user.passwordSalt, password))
      ) {
        res.sendStatus(401);
        return;
      }

      const accessToken = jwt.sign(
        { _id: user.id },
        backendConfig.auth.jwt.secret,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { _id: user.id },
        backendConfig.auth.jwt.secret,
        { expiresIn: "1d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ accessToken, id: user.id });
    }
  );

  router.get("/refresh", async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      res.sendStatus(401);
      return;
    }
    const refreshToken = cookies.jwt;

    const user = await UserModel.findOne({
      refreshToken,
    });
    if (!user) {
      res.sendStatus(403);
      return;
    }
    jwt.verify(
      refreshToken,
      backendConfig.auth.jwt.secret,
      (err: Error, decoded: { id: Schema.Types.ObjectId }) => {
        if (err || user.id !== decoded.id) return res.sendStatus(403);
        const accessToken = jwt.sign(
          { id: decoded.id },
          backendConfig.auth.jwt.secret,
          { expiresIn: "30s" }
        );
        res.json({ accessToken });
      }
    );
  });

  return router;
};
