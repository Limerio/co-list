import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Schema } from "mongoose";
import { backendConfig } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    backendConfig.auth.jwt.secret,
    (err, decoded: { id: Schema.Types.ObjectId }) => {
      if (err) return res.sendStatus(403);
      req.session.user = decoded;
      next();
    }
  );
};
