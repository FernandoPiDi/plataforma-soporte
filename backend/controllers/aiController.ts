import type { Request, Response } from "express";

import { aiService } from "../services/aiService.js";
import { ticketService } from "../services/ticketService.js";

export const aiController = {
  async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const ticketId = parseInt(req.params.ticketId as string);
      const userId = req.user!.id;
      const roleName = req.user!.rol_nombre;

      // Only Support and Admin users can access AI suggestions
      if (roleName === "Cliente") {
        res.status(403).json({
          error: "No tiene permisos para acceder a las sugerencias de IA",
        });
        return;
      }

      // Verify user has access to this ticket
      const ticket = await ticketService.getTicketById(ticketId);

      if (!ticket) {
        res.status(404).json({ error: "Solicitud no encontrada" });
        return;
      }

      if (!ticketService.canAccessTicket(ticket, userId, roleName)) {
        res.status(403).json({
          error: "No tiene permisos para acceder a esta solicitud",
        });
        return;
      }

      // Generate AI suggestions
      const suggestions = await aiService.generateSuggestions(
        ticket.titulo,
        ticket.descripcion,
      );

      res.status(200).json({ suggestions });
    } catch (error) {
      console.error("Error in getSuggestions:", error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res
          .status(500)
          .json({ error: "Error al generar sugerencias de respuesta" });
      }
    }
  },
};

