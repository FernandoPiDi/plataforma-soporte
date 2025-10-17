import type { Response } from "../types/index.js";

import pool from "../config/db.js";

export const responseService = {
  async createResponse(
    ticketId: number,
    respuesta: string,
    userId: number,
  ): Promise<Response> {
    // Verify ticket exists
    const ticketCheck = await pool.query(
      "SELECT id FROM solicitudes WHERE id = $1",
      [ticketId],
    );

    if (ticketCheck.rows.length === 0) {
      throw new Error("Solicitud no encontrada");
    }

    const result = await pool.query(
      `
      INSERT INTO respuestas (solicitud_id, respuesta, creada_por_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [ticketId, respuesta, userId],
    );

    return result.rows[0];
  },

  async getResponsesByTicketId(ticketId: number): Promise<Response[]> {
    const result = await pool.query(
      `
      SELECT 
        r.*,
        u.nombre as creada_por_nombre,
        u.email as creada_por_email
      FROM respuestas r
      LEFT JOIN usuarios u ON r.creada_por_id = u.id
      WHERE r.solicitud_id = $1
      ORDER BY r.fecha_creacion ASC
    `,
      [ticketId],
    );

    return result.rows;
  },
};
