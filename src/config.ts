import dotenv from "dotenv";
const env = dotenv.config({ path: "./.env" }) 

if (env.error) {
  console.error("Failed to load .env file:", env.error);
  process.exit(1);
}

const KNOWN_WEAK_SECRETS = new Set([
  "secret", "changeme", "jwt_secret", "your_jwt_secret", "mysecret",
  "supersecret", "yoursecret", "jwtsecret", "jwt-secret", "example",
]);

if (!process.env.JWT_SECRET_KEY) {
  console.error("Error: JWT_SECRET_KEY is missing in environment variables.");
  process.exit(1);
}

if (process.env.JWT_SECRET_KEY.length < 64) {
  console.error("Error: JWT_SECRET_KEY must be at least 64 characters. Generate one with: openssl rand -hex 64");
  process.exit(1);
}

if (KNOWN_WEAK_SECRETS.has(process.env.JWT_SECRET_KEY.toLowerCase())) {
  console.error("Error: JWT_SECRET_KEY matches a known weak value. Use a randomly generated secret.");
  process.exit(1);
}

if (process.env.ENV === "prod" && !process.env.CORS_ORIGIN) {
  console.error("CORS_ORIGIN is not set in production environment.");
  process.exit(1);
}

export const config = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY ?? "15m",
  REFRESH_TOKEN_EXPIRY_DAYS: parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS ?? "30"),
  LOCAL_SALT_ROUNDS: process.env.ENV === "prod" ? 14 : 10,
  ENV: process.env.ENV ?? "local",
  USER_DEFAULT_PASSWORD: process.env.USER_DEFAULT_PASSWORD ?? "",
};
