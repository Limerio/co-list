import type { Session, SessionData } from "express-session";

declare module "express-serve-static-core" {
  interface Request {
    session: Session & Partial<SessionData> & { user: UserModel };
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string;
      readonly AUTH_SESSION_SECRET: string;
      readonly PORT: string;
      readonly CORS_URLS: string;
      readonly AUTH_PASSWORD_DIGEST: string;
      readonly AUTH_JWT_SECRET: string;
    }
  }
}
