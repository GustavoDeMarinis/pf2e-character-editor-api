import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import app from "./app";
import router from "./router";
//For env File
dotenv.config();
const port = process.env.PORT || 5000;
const SERVICE_PATH_PREFIX = process.env.SERVICE_PATH_PREFIX || "";
app.use(SERVICE_PATH_PREFIX, router);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
