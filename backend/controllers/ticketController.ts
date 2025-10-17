import type { Request, Response } from "express";

import type { TicketStatus } from "../types/index.js";

import { emailService } from "../services/emailService.js";
import { ticketService } from "../services/ticketService.js";

export const ticketController = {
  async assignTicket(req: Request, res: Response): Promise<void> {
    try {
      const ticketId = parseInt(req.params.id as string);
      const userId = req.user!.id;

      const ticket = await ticketService.assignTicket(ticketId, userId);


      const assignedUser = req.user!;
      await emailService.sendTicketAssignedEmail(ticket, assignedUser);

      res.status(200).json({
        message: "Solicitud asignada exitosamente",
        ticket,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error al asignar solicitud" });
      }
    }
  },

  async createTicket(req: Request, res: Response): Promise<void> {
    try {
      const { descripcion, titulo } = req.body;
      const userId = req.user!.id;

      if (!titulo || !descripcion) {
        res.status(400).json({
          error: "Título y descripción son requeridos",
        });
        return;
      }

      const ticket = await ticketService.createTicket(
        titulo,
        descripcion,
        userId,
      );

      // Send email notification to admins and soporte users
      const creator = req.user!;
      await emailService.sendTicketCreatedEmail(ticket, creator);

      res.status(201).json({
        message: "Solicitud creada exitosamente",
        ticket,
      });
    } catch (_error) {
      res.status(500).json({ error: "Error al crear solicitud" });
    }
  },

  async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const ticketId = parseInt(req.params.id as string);
      const userId = req.user!.id;
      const roleName = req.user!.rol_nombre;

      const ticket = await ticketService.getTicketById(ticketId);

      if (!ticket) {
        res.status(404).json({ error: "Solicitud no encontrada" });
        return;
      }


      if (!ticketService.canAccessTicket(ticket, userId, roleName)) {
        res.status(403).json({
          error: "No tiene permisos para ver esta solicitud",
        });
        return;
      }

      res.status(200).json({ ticket });
    } catch (_error) {
      res.status(500).json({ error: "Error al obtener solicitud" });
    }
  },

  async getTickets(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const roleName = req.user!.rol_nombre;

      const tickets = await ticketService.getTicketsByRole(userId, roleName);

      res.status(200).json({ tickets });
    } catch (_error) {
      res.status(500).json({ error: "Error al obtener solicitudes" });
    }
  },

  async updateTicketStatus(req: Request, res: Response): Promise<void> {
    try {
      const ticketId = parseInt(req.params.id as string);
      const { estado } = req.body;

      if (!estado) {
        res.status(400).json({ error: "El estado es requerido" });
        return;
      }


      const oldTicket = await ticketService.getTicketById(ticketId);
      if (!oldTicket) {
        res.status(404).json({ error: "Solicitud no encontrada" });
        return;
      }

      const ticket = await ticketService.updateTicketStatus(
        ticketId,
        estado as TicketStatus,
      );


      await emailService.sendTicketStatusChangedEmail(ticket, oldTicket.estado);

      res.status(200).json({
        message: "Estado actualizado exitosamente",
        ticket,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error al actualizar estado" });
      }
    }
  },

  async getTicketStats(req: Request, res: Response): Promise<void> {
    try {

      const roleName = req.user!.rol_nombre;
      if (roleName !== "Administrador") {
        res.status(403).json({
          error: "No tiene permisos para acceder a las estadísticas",
        });
        return;
      }

      const stats = await ticketService.getTicketStats();
      res.status(200).json({ stats });
    } catch (_error) {
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  },
};
