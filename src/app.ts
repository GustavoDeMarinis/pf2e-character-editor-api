import router from "./router";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Received request for ${req.url}`);
  next();
});

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests only from this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

export default app;
