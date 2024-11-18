import "dotenv/config";
import { z } from "zod";

const backendSchema = z.object({
  server: z.object({
    port: z.string().transform((arg) => parseInt(arg)),
    cors: z.array(z.string().url()),
  }),
  db: z.object({
    url: z.string().url(),
  }),
  auth: z.object({
    session: z.object({
      secret: z.string().min(40),
    }),
    jwt: z.object({
      secret: z.string().min(40),
    }),
    password: z.object({
      iterations: z.number(),
      keyLength: z.number(),
      digest: z.string(),
    }),
  }),
});

const data = {
  server: {
    port: process.env.PORT,
    cors: process.env.CORS_URLS.split(","),
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    session: {
      secret: process.env.AUTH_SESSION_SECRET,
    },
    jwt: {
      secret: process.env.AUTH_JWT_SECRET,
    },
    password: {
      iterations: 10000,
      keyLength: 64,
      digest: "sha512",
    },
  },
} satisfies z.input<typeof backendSchema>;

export const backendConfig = (() => {
  try {
    return backendSchema.parse(data);
  } catch (error) {
    const { errors } = error as z.ZodError;
    const formattedErrors = errors.map(
      ({ path, message }) => `\t- ${path.join(".")}: ${message}\n`
    );

    throw new Error(`invalid config\n${formattedErrors.join("")}`);
  }
})();
