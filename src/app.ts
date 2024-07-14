import router from "./router";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`Received request for ${req.url}`);
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

export default app;
