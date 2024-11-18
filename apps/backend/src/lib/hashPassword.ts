import { pbkdf2, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { backendConfig } from "../config";

const pbkdf2Async = promisify(pbkdf2);

const { iterations, digest, keyLength } = backendConfig.auth.password;

export const hashPassword = async (password: string) => {
  const passwordSalt = randomBytes(16).toString("hex");

  return {
    passwordSalt,
    passwordHash: (
      await pbkdf2Async(password, passwordSalt, iterations, keyLength, digest)
    ).toString("hex"),
  };
};

export const isValidPassword = async (
  hash: string,
  salt: string,
  password: string
) => {
  return (
    hash ==
    (await pbkdf2Async(password, salt, iterations, keyLength, digest)).toString(
      "hex"
    )
  );
};
