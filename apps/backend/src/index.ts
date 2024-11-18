import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import session from "express-session";
import mongoose from "mongoose";
import { backendConfig } from "./config";
import { authMiddleware } from "./middlewares/auth";
import { models } from "./models";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";

const app = express();

await mongoose.connect(backendConfig.db.url);

const context = {
  models,
} as const;

export type Context = typeof context;

app
  .use(
    cors({
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      origin: backendConfig.server.cors,
    })
  )
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(cookieParser())
  .use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  )
  .use(
    "/api",
    Router()
      .use("/auth", authRouter(context))
      .use(authMiddleware)
      .use("/users", usersRouter(context))
  );

app.listen(backendConfig.server.port);
