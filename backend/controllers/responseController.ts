import type { Request, Response } from "express";

import { emailService } from "../services/emailService.js";
import { responseService } from "../services/responseService.js";
import { ticketService } from "../services/ticketService.js";

export const responseController = {
  async createResponse(req: Request, res: Response): Promise<void> {
    try {
      const ticketId = parseInt(req.params.ticketId as string);
      const { respuesta } = req.body;
      const userId = req.user!.id;
      const roleName = req.user!.rol_nombre;

      if (!respuesta) {
        res.status(400).json({ error: "La respuesta es requerida" });
        return;
      }

      const ticket = await ticketService.getTicketById(ticketId);

      if (!ticket) {
        res.status(404).json({ error: "Solicitud no encontrada" });
        return;
      }

      if (!ticketService.canAccessTicket(ticket, userId, roleName)) {
        res.status(403).json({
          error: "No tiene permisos para responder a esta solicitud",
        });
        return;
      }

      const response = await responseService.createResponse(
        ticketId,
        respuesta,
        userId,
      );


      const responder = req.user!;
      await emailService.sendResponseAddedEmail(
        ticketId,
        ticket.titulo,
        respuesta,
        responder,
        ticket.creada_por_id,
        ticket.asignada_a_id,
      );

      res.status(201).json({
        message: "Respuesta creada exitosamente",
        response,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error al crear respuesta" });
      }
    }
  },

  async getResponsesByTicketId(req: Request, res: Response): Promise<void> {
    try {
      const ticketId = parseInt(req.params.ticketId as string);
      const userId = req.user!.id;
      const roleName = req.user!.rol_nombre;


      const ticket = await ticketService.getTicketById(ticketId);

      if (!ticket) {
        res.status(404).json({ error: "Solicitud no encontrada" });
        return;
      }

      if (!ticketService.canAccessTicket(ticket, userId, roleName)) {
        res.status(403).json({
          error: "No tiene permisos para ver las respuestas de esta solicitud",
        });
        return;
      }

      const responses = await responseService.getResponsesByTicketId(ticketId);

      res.status(200).json({ responses });
    } catch (_error) {
      res.status(500).json({ error: "Error al obtener respuestas" });
    }
  },
};
