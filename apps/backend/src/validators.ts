import { z } from "zod";

export const paramUserIdValidator = z.string().min(1);
export const paramListIdValidator = z.string().min(1);
