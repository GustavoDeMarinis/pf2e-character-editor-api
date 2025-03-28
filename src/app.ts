import router from "./router";
import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
const app = express();

app.use(helmet());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Received request for ${req.url}`);
  next();
});

const allowedOrigins: string[] = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:5000"];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    console.log("process.env.ENV", process.env.ENV)
    if (!origin && process.env.ENV === "local") {
      return callback(null, true);  // Allow missing origin in development
    }
    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy violation: Origin not allowed"));
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

export default app;
