export interface Response {
  creada_por_email?: string;
  creada_por_id: number;
  creada_por_nombre?: string;
  fecha_creacion: Date;
  id: number;
  respuesta: string;
  solicitud_id: number;
}

export interface Role {
  id: number;
  nombre: string;
}

export type RoleName = "Administrador" | "Cliente" | "Soporte";

export interface SessionUser {
  email: string;
  id: number;
  nombre: string;
  rol_id: number;
  rol_nombre: RoleName;
}

export interface Ticket {
  asignada_a_email?: string;
  asignada_a_id: null | number;
  asignada_a_nombre?: string;
  creada_por_email?: string;
  creada_por_id: number;
  creada_por_nombre?: string;
  descripcion: string;
  estado: TicketStatus;
  fecha_actualizacion: Date;
  fecha_creacion: Date;
  id: number;
  titulo: string;
}

export type TicketStatus = "abierta" | "cerrada" | "en progreso";

export interface User {
  contrasena: string;
  email: string;
  id: number;
  nombre: string;
  rol_id: number;
  rol_nombre?: string;
}

// Extend Express Request type to include user from JWT
declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}
