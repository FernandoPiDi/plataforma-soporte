import type { NextFunction, Request, Response } from "express";

import type { RoleName } from "../types/index.js";
import { authService } from "../services/authService.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No autorizado. Debe iniciar sesión." });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = authService.verifyToken(token);

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
    return;
  }
};

export const requireRole = (...roles: RoleName[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "No autorizado. Debe iniciar sesión." });
      return;
    }

    const userRole = user.rol_nombre;
    if (!roles.includes(userRole)) {
      res.status(403).json({
        error: "No tiene permisos para realizar esta acción.",
      });
      return;
    }

    next();
  };
};
