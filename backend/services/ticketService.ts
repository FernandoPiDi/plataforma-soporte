import type { RoleName, Ticket, TicketStatus } from "../types/index.js";

import pool from "../config/db.js";

export const ticketService = {
  async assignTicket(ticketId: number, userId: number): Promise<Ticket> {
    const result = await pool.query(
      `
      UPDATE solicitudes
      SET asignada_a_id = $1, estado = 'en progreso', fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $2 AND (asignada_a_id IS NULL OR estado = 'abierta')
      RETURNING *
    `,
      [userId, ticketId],
    );

    if (result.rows.length === 0) {
      throw new Error(
        "No se pudo asignar el ticket. Puede que ya esté asignado.",
      );
    }

    return result.rows[0];
  },

  canAccessTicket(ticket: Ticket, userId: number, roleName: RoleName): boolean {
    if (roleName === "Administrador") {
      return true;
    }

    if (roleName === "Soporte") {
      // Soporte can access assigned tickets or unassigned open tickets
      return (
        ticket.asignada_a_id === userId ||
        (ticket.estado === "abierta" && ticket.asignada_a_id === null)
      );
    }

    // Cliente can only access their own tickets
    return ticket.creada_por_id === userId;
  },

  async createTicket(
    titulo: string,
    descripcion: string,
    userId: number,
  ): Promise<Ticket> {
    const result = await pool.query(
      `
      INSERT INTO solicitudes (titulo, descripcion, estado, creada_por_id)
      VALUES ($1, $2, 'abierta', $3)
      RETURNING *
    `,
      [titulo, descripcion, userId],
    );

    return result.rows[0];
  },

  async getTicketById(ticketId: number): Promise<null | Ticket> {
    const result = await pool.query(
      `
      SELECT 
        s.*,
        uc.nombre as creada_por_nombre,
        uc.email as creada_por_email,
        ua.nombre as asignada_a_nombre,
        ua.email as asignada_a_email
      FROM solicitudes s
      LEFT JOIN usuarios uc ON s.creada_por_id = uc.id
      LEFT JOIN usuarios ua ON s.asignada_a_id = ua.id
      WHERE s.id = $1
    `,
      [ticketId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  },

  async getTicketsByRole(
    userId: number,
    roleName: RoleName,
  ): Promise<Ticket[]> {
    let query = "";

    if (roleName === "Cliente") {
      // Cliente: only their own tickets
      query = `
        SELECT 
          s.*,
          uc.nombre as creada_por_nombre,
          uc.email as creada_por_email,
          ua.nombre as asignada_a_nombre,
          ua.email as asignada_a_email
        FROM solicitudes s
        LEFT JOIN usuarios uc ON s.creada_por_id = uc.id
        LEFT JOIN usuarios ua ON s.asignada_a_id = ua.id
        WHERE s.creada_por_id = $1
        ORDER BY s.fecha_creacion DESC
      `;
    } else if (roleName === "Soporte") {
      // Soporte: assigned tickets + unassigned open tickets
      query = `
        SELECT 
          s.*,
          uc.nombre as creada_por_nombre,
          uc.email as creada_por_email,
          ua.nombre as asignada_a_nombre,
          ua.email as asignada_a_email
        FROM solicitudes s
        LEFT JOIN usuarios uc ON s.creada_por_id = uc.id
        LEFT JOIN usuarios ua ON s.asignada_a_id = ua.id
        WHERE s.asignada_a_id = $1 OR (s.estado = 'abierta' AND s.asignada_a_id IS NULL)
        ORDER BY s.fecha_creacion DESC
      `;
    } else {
      // Administrador: all tickets
      query = `
        SELECT 
          s.*,
          uc.nombre as creada_por_nombre,
          uc.email as creada_por_email,
          ua.nombre as asignada_a_nombre,
          ua.email as asignada_a_email
        FROM solicitudes s
        LEFT JOIN usuarios uc ON s.creada_por_id = uc.id
        LEFT JOIN usuarios ua ON s.asignada_a_id = ua.id
        ORDER BY s.fecha_creacion DESC
      `;
    }

    const result = await pool.query(
      query,
      roleName === "Administrador" ? [] : [userId],
    );
    return result.rows;
  },

  async updateTicketStatus(
    ticketId: number,
    status: TicketStatus,
  ): Promise<Ticket> {
    const validStatuses: TicketStatus[] = ["abierta", "en progreso", "cerrada"];

    if (!validStatuses.includes(status)) {
      throw new Error("Estado inválido");
    }

    const result = await pool.query(
      `
      UPDATE solicitudes
      SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `,
      [status, ticketId],
    );

    if (result.rows.length === 0) {
      throw new Error("Ticket no encontrado");
    }

    return result.rows[0];
  },

  async getTicketStats() {
    // Get tickets by status
    const statusResult = await pool.query(`
      SELECT estado, COUNT(*) as count
      FROM solicitudes
      GROUP BY estado
    `);

    // Get tickets by client (top 10)
    const clientResult = await pool.query(`
      SELECT 
        u.nombre as client_name,
        COUNT(s.id) as count
      FROM solicitudes s
      JOIN usuarios u ON s.creada_por_id = u.id
      GROUP BY u.id, u.nombre
      ORDER BY count DESC
      LIMIT 10
    `);

    // Get tickets timeline (last 30 days)
    const timelineResult = await pool.query(`
      SELECT 
        DATE(fecha_creacion) as date,
        COUNT(*) as count
      FROM solicitudes
      WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(fecha_creacion)
      ORDER BY date ASC
    `);

    return {
      byStatus: statusResult.rows,
      byClient: clientResult.rows,
      timeline: timelineResult.rows,
    };
  },
};
