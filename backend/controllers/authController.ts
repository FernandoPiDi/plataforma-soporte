import type { Request, Response } from "express";

import { authService } from "../services/authService.js";

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: "Email y contraseña son requeridos",
        });
        return;
      }

      const user = await authService.login(email, password);

      // Generate JWT token
      const token = authService.generateToken(user);

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          email: user.email,
          id: user.id,
          nombre: user.nombre,
          rol_nombre: user.rol_nombre,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error al iniciar sesión" });
      }
    }
  },

  async logout(req: Request, res: Response): Promise<void> {
    // With JWT, logout is handled on the client side by removing the token
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  },

  async me(req: Request, res: Response): Promise<void> {
    // User is attached to req by auth middleware
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    res.status(200).json({
      user: {
        email: user.email,
        id: user.id,
        nombre: user.nombre,
        rol_nombre: user.rol_nombre,
      },
    });
  },

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, nombre, password } = req.body;

      if (!nombre || !email || !password) {
        res.status(400).json({
          error: "Nombre, email y contraseña son requeridos",
        });
        return;
      }

      const user = await authService.register(nombre, email, password);

      // Generate JWT token
      const token = authService.generateToken(user);

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        token,
        user: {
          email: user.email,
          id: user.id,
          nombre: user.nombre,
          rol_nombre: user.rol_nombre,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error al registrar usuario" });
      }
    }
  },
};
