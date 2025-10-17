import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { SessionUser, User } from "../types/index.js";

import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export const authService = {
  generateToken(user: SessionUser): string {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol_id: user.rol_id,
        rol_nombre: user.rol_nombre,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
    return token;
  },

  verifyToken(token: string): SessionUser {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
      return decoded;
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  },

  async getUserById(id: number): Promise<null | SessionUser> {
    const result = await pool.query(
      `
      SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];

    return {
      email: user.email,
      id: user.id,
      nombre: user.nombre,
      rol_id: user.rol_id,
      rol_nombre: user.rol_nombre,
    };
  },

  async login(email: string, password: string): Promise<SessionUser> {
    // Find user with role information
    const result = await pool.query(
      `
      SELECT u.id, u.nombre, u.email, u.contrasena, u.rol_id, r.nombre as rol_nombre
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1
    `,
      [email],
    );

    if (result.rows.length === 0) {
      throw new Error("Credenciales incorrectas");
    }

    const user = result.rows[0] as User & { rol_nombre: string };


    const isValidPassword = await bcrypt.compare(password, user.contrasena);

    if (!isValidPassword) {
      throw new Error("Credenciales incorrectas");
    }

    return {
      email: user.email,
      id: user.id,
      nombre: user.nombre,
      rol_id: user.rol_id,
      rol_nombre: user.rol_nombre as SessionUser["rol_nombre"],
    };
  },

  async register(
    nombre: string,
    email: string,
    password: string,
  ): Promise<SessionUser> {
    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      throw new Error("El correo electrónico ya está registrado");
    }

    // Get Cliente role ID
    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE nombre = $1",
      ["Cliente"],
    );

    if (roleResult.rows.length === 0) {
      throw new Error("Rol Cliente no encontrado");
    }

    const clienteRoleId = roleResult.rows[0].id;


    const hashedPassword = await bcrypt.hash(password, 10);


    const result = await pool.query(
      `
      INSERT INTO usuarios (nombre, email, contrasena, rol_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, rol_id
    `,
      [nombre, email, hashedPassword, clienteRoleId],
    );

    const user = result.rows[0];

    return {
      email: user.email,
      id: user.id,
      nombre: user.nombre,
      rol_id: user.rol_id,
      rol_nombre: "Cliente",
    };
  },
};
