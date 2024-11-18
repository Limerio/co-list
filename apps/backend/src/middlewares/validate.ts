import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodObject } from "zod";

export const validateMiddleware =
  (
    schema: ZodObject<{
      body?: AnyZodObject;
      query?: AnyZodObject;
      params?: AnyZodObject;
    }>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      res.status(400).json(error);
    }
  };
