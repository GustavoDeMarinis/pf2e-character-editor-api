import dotenv from "dotenv";
const env = dotenv.config();

if (env.error) {
  throw new Error("No .env file found");
}

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("No JWT_SECRET_KEY found in .env file");
}

export const config = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ?? "",
  JWT_EXPIRATION_PERIOD: "1d",
  LOCAL_SALT_ROUNDS: process.env.ENV === "prod" ? 14 : 10,
  ENV: process.env.ENV ?? "local",
  USER_DEFAULT_PASSWORD: process.env.USER_DEFAULT_PASSWORD ?? "",
};
