import router from "./router";
import express, { Handler, Request, Response } from "express";

const SERVICE_PATH_PREFIX = "";

const app = express();

app.set("port", process.env.PORT || 3080);

app.use(SERVICE_PATH_PREFIX, router);

export default app;
