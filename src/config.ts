import dotenv from "dotenv";
const env = dotenv.config();

export const config = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ?? "",
  JWT_EXPIRATION_PERIOD: "1d",
  LOCAL_SALT_ROUNDS: 10,
  ENV: process.env.ENV ?? "local",
  USER_DEFAULT_PASSWORD: process.env.USER_DEFAULT_PASSWORD ?? "",
};
