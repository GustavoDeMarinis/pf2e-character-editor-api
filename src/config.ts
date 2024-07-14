import dotenv from "dotenv";
const env = dotenv.config();

export const config = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY ?? "",
  JWT_EXPIRATION_PERIOD: 30,
};
