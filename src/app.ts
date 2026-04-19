import router from "./router";
import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import { csrfMiddleware } from "./middleware/security/csrf";
import { globalErrorHandler } from "./middleware/error-handler";
import { requestIdMiddleware } from "./middleware/request-id";
import { requestLogger } from "./middleware/request-logger";
const app = express();

app.use(requestIdMiddleware);
app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);

const allowedOrigins: string[] = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:5000"];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin && process.env.ENV === "local") {
      return callback(null, true);  // Allow missing origin in development
    }
    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy violation: Origin not allowed"));
  },
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(csrfMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(globalErrorHandler);

export default app;
