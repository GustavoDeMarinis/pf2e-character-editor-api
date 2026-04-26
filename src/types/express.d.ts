declare namespace Express {
  interface Request {
    id: string;
    auth?: import("../middleware/security/authorization").AuthPayload;
  }
}
