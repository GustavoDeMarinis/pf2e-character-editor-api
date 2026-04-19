import { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      id: string;
      auth?: {
        userId: string;
        role: UserRole;
        sessionId: string;
      };
    }
  }
}
