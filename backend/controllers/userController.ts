import type { Request, Response } from "express";

import { userService } from "../services/userService.js";

export const userController = {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ users });
    } catch (_error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },

  async getRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await userService.getRoles();
      res.status(200).json({ roles });
    } catch (_error) {
      res.status(500).json({ error: "Error al obtener roles" });
    }
  },

  async updateUserRole(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id as string);
      const { rol_id } = req.body;

      if (!rol_id) {
        res.status(400).json({ error: "El rol_id es requerido" });
        return;
      }

      const user = await userService.updateUserRole(userId, rol_id);

      res.status(200).json({
        message: "Rol actualizado exitosamente",
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error al actualizar rol" });
      }
    }
  },
};
