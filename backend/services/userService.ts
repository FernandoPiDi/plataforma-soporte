import type { User } from "../types/index.js";

import pool from "../config/db.js";

export const userService = {
  async getAllUsers(): Promise<
    {
      email: string;
      id: number;
      nombre: string;
      rol_id: number;
      rol_nombre: string;
    }[]
  > {
    const result = await pool.query(`
      SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id
    `);

    return result.rows;
  },

  async getRoles(): Promise<{ id: number; nombre: string }[]> {
    const result = await pool.query("SELECT id, nombre FROM roles ORDER BY id");
    return result.rows;
  },

  async updateUserRole(userId: number, newRoleId: number): Promise<User> {
    // Verify role exists
    const roleCheck = await pool.query("SELECT id FROM roles WHERE id = $1", [
      newRoleId,
    ]);

    if (roleCheck.rows.length === 0) {
      throw new Error("Rol no encontrado");
    }

    // Update user role
    const result = await pool.query(
      `
      UPDATE usuarios
      SET rol_id = $1
      WHERE id = $2
      RETURNING id, nombre, email, rol_id
    `,
      [newRoleId, userId],
    );

    if (result.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    return result.rows[0];
  },
};
