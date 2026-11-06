// Express app ka setup (middlewares aur routes yahan lagengay)
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./modules/health/health.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Sirf CLIENT_URL me likhay hue frontend URLs ko allow karo
app.use(cors({ origin: env.clientUrls }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Elite Rides API is running" });
});

// Module routes
app.use("/api/health", healthRoutes);

// Error handler hamesha sab se last me
app.use(errorHandler);

export default app;
