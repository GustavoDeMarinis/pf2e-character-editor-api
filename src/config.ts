import dotenv from "dotenv";
const env = dotenv.config({ path: "./.env" }) 

if (env.error) {
  console.error("Failed to load .env file:", env.error);
  process.exit(1);
}

if (!process.env.JWT_SECRET_KEY) {
  console.error("Error: JWT_SECRET_KEY is missing in environment variables.");
  process.exit(1);
}

if (process.env.ENV === "prod" && !process.env.CORS_ORIGIN) {
  console.error("CORS_ORIGIN is not set in production environment.");
  process.exit(1);
}

export const config = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
  JWT_EXPIRATION_PERIOD: process.env.JWT_EXPIRATION_PERIOD ?? "1d",
  LOCAL_SALT_ROUNDS: process.env.ENV === "prod" ? 14 : 10,
  ENV: process.env.ENV ?? "local",
  USER_DEFAULT_PASSWORD: process.env.USER_DEFAULT_PASSWORD ?? "",
};
