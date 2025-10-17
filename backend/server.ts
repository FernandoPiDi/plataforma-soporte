import type { Request, Response } from "express";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { connectDB } from "./config/db.js";
import { swaggerOptions } from "./config/swagger.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000", 10);

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL ?? "http://localhost:3001",
  }),
);
app.use(express.json());

// Connect to database
void connectDB();

// Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", responseRoutes);
app.use("/api/tickets", aiRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Support Ticket System API",
    status: "running",
  });
});

// Error handling middleware
app.use(
  (err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  },
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
});
