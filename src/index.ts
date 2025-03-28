import app  from "./app";
import { PrismaClient } from "@prisma/client";

const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown function
const gracefulShutdown = async () => {
  console.log("\n Shutting down gracefully...");

  try {
    console.log("Closing database connection...");
    await prisma.$disconnect();

    const forceShutdown = setTimeout(() => {
      console.error("Forcefully shutting down...");
      process.exit(1);
    }, 5000);

    console.log("Closing server...");
    server.close(() => {
      clearTimeout(forceShutdown);
      console.log("Server closed.");
      process.exit(0);
    });

 
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGINT", gracefulShutdown);  // Ctrl+C in terminal
process.on("SIGTERM", gracefulShutdown); // When stopping the app from a process manager


// Global Error Handling
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});

//TODO check pm2, Docker, or systemd to handle restarts properly.