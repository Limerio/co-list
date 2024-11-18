import { z } from "zod";

export const idValidator = z.string().min(1);
