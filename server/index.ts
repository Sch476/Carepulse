import dotenv from "dotenv";
import express from "express";
 
// Load environment variables from .env.local first, then .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSetRole } from "./routes/set-role";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // Clerk role assignment
  app.post("/api/set-role", handleSetRole);

  return app;
}
