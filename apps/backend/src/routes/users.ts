import { Router } from "express";
import { z } from "zod";
import type { Context } from "..";
import { validateMiddleware } from "../middlewares/validate";
import { idValidator } from "../validators";
import { listsRouter } from "./users/lists";

const router = Router();

export const userParamId = z.object({
  params: z.object({
    userId: idValidator,
  }),
});

export const usersRouter = (ctx: Context) => {
  router.use(
    "/:userId/lists",
    validateMiddleware(userParamId),
    listsRouter(ctx)
  );

  return router;
};
