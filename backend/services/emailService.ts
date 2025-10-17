import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

import type { SessionUser, Ticket, User } from "../types/index.js";

import pool from "../config/db.js";


const SMTP_HOST = process.env.SMTP_HOST || "mailhog";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "1025");
const SMTP_FROM = process.env.SMTP_FROM || "noreply@support-tickets.local";


let transporter: Transporter;

try {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, 
    tls: {
      rejectUnauthorized: false,
    },
  });
} catch (error) {
  console.error("Error creating email transporter:", error);

  transporter = {
    sendMail: async (mailOptions: any) => {
      console.log("Email would be sent:", mailOptions);
      return { messageId: "dummy-id" };
    },
  } as any;
}


async function getUsersByRole(roleName: string): Promise<User[]> {
  const result = await pool.query(
    `
    SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol_nombre
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE r.nombre = $1
  `,
    [roleName],
  );

  return result.rows;
}


async function getUserById(userId: number): Promise<User | null> {
  const result = await pool.query(
    `
    SELECT u.id, u.nombre, u.email, u.rol_id, r.nombre as rol_nombre
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE u.id = $1
  `,
    [userId],
  );

  return result.rows[0] || null;
}

export const emailService = {
  /**
   * Send email notification when a new ticket is created
   * Notifies all admin and soporte users
   */
  async sendTicketCreatedEmail(ticket: Ticket, creator: SessionUser): Promise<void> {
    try {
      // Get all admin and soporte users
      const admins = await getUsersByRole("administrador");
      const soporte = await getUsersByRole("soporte");
      const recipients = [...admins, ...soporte];

      if (recipients.length === 0) {
        console.log("No admin/soporte users to notify for new ticket");
        return;
      }

      const emailPromises = recipients.map((recipient) =>
        transporter.sendMail({
          from: SMTP_FROM,
          to: recipient.email,
          subject: `Nueva Solicitud #${ticket.id}: ${ticket.titulo}`,
          html: `
            <h2>Nueva Solicitud Creada</h2>
            <p><strong>Ticket #${ticket.id}</strong></p>
            <p><strong>Título:</strong> ${ticket.titulo}</p>
            <p><strong>Descripción:</strong> ${ticket.descripcion}</p>
            <p><strong>Estado:</strong> ${ticket.estado}</p>
            <p><strong>Creado por:</strong> ${creator.nombre} (${creator.email})</p>
            <p><strong>Fecha:</strong> ${new Date(ticket.fecha_creacion).toLocaleString("es-ES")}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Este es un correo automático del Sistema de Gestión de Solicitudes.</p>
          `,
          text: `
Nueva Solicitud Creada

Ticket #${ticket.id}
Título: ${ticket.titulo}
Descripción: ${ticket.descripcion}
Estado: ${ticket.estado}
Creado por: ${creator.nombre} (${creator.email})
Fecha: ${new Date(ticket.fecha_creacion).toLocaleString("es-ES")}

Este es un correo automático del Sistema de Gestión de Solicitudes.
          `,
        }),
      );

      await Promise.all(emailPromises);
      console.log(
        `Ticket created notification sent to ${recipients.length} recipients`,
      );
    } catch (error) {
      console.error("Error sending ticket created email:", error);
      // Don't throw - email failures shouldn't break ticket creation
    }
  },

  /**
   * Send email notification when a ticket is assigned to a support user
   */
  async sendTicketAssignedEmail(ticket: Ticket, assignedUser: SessionUser): Promise<void> {
    try {
      const creator = await getUserById(ticket.creada_por_id);

      if (!creator) {
        console.log("Creator not found for ticket assignment notification");
        return;
      }

      await transporter.sendMail({
        from: SMTP_FROM,
        to: assignedUser.email,
        subject: `Solicitud Asignada #${ticket.id}: ${ticket.titulo}`,
        html: `
          <h2>Solicitud Asignada a Ti</h2>
          <p><strong>Ticket #${ticket.id}</strong></p>
          <p><strong>Título:</strong> ${ticket.titulo}</p>
          <p><strong>Descripción:</strong> ${ticket.descripcion}</p>
          <p><strong>Estado:</strong> ${ticket.estado}</p>
          <p><strong>Creado por:</strong> ${creator.nombre} (${creator.email})</p>
          <p><strong>Fecha de creación:</strong> ${new Date(ticket.fecha_creacion).toLocaleString("es-ES")}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este es un correo automático del Sistema de Gestión de Solicitudes.</p>
        `,
        text: `
Solicitud Asignada a Ti

Ticket #${ticket.id}
Título: ${ticket.titulo}
Descripción: ${ticket.descripcion}
Estado: ${ticket.estado}
Creado por: ${creator.nombre} (${creator.email})
Fecha de creación: ${new Date(ticket.fecha_creacion).toLocaleString("es-ES")}

Este es un correo automático del Sistema de Gestión de Solicitudes.
        `,
      });

      console.log(`Ticket assigned notification sent to ${assignedUser.email}`);
    } catch (error) {
      console.error("Error sending ticket assigned email:", error);
    }
  },

  /**
   * Send email notification when a ticket status changes
   * Notifies the creator and the assigned user (if any)
   */
  async sendTicketStatusChangedEmail(ticket: Ticket, oldStatus: string): Promise<void> {
    try {
      const creator = await getUserById(ticket.creada_por_id);
      const recipients: User[] = [];

      if (creator) {
        recipients.push(creator);
      }

      // If ticket is assigned, notify the assigned user too (if different from creator)
      if (ticket.asignada_a_id && ticket.asignada_a_id !== ticket.creada_por_id) {
        const assignedUser = await getUserById(ticket.asignada_a_id);
        if (assignedUser) {
          recipients.push(assignedUser);
        }
      }

      if (recipients.length === 0) {
        console.log("No recipients for ticket status change notification");
        return;
      }

      const emailPromises = recipients.map((recipient) =>
        transporter.sendMail({
          from: SMTP_FROM,
          to: recipient.email,
          subject: `Cambio de Estado #${ticket.id}: ${ticket.titulo}`,
          html: `
            <h2>Estado de Solicitud Actualizado</h2>
            <p><strong>Ticket #${ticket.id}</strong></p>
            <p><strong>Título:</strong> ${ticket.titulo}</p>
            <p><strong>Estado anterior:</strong> <span style="color: #999;">${oldStatus}</span></p>
            <p><strong>Estado nuevo:</strong> <span style="color: #2563eb; font-weight: bold;">${ticket.estado}</span></p>
            <p><strong>Fecha de actualización:</strong> ${new Date(ticket.fecha_actualizacion).toLocaleString("es-ES")}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Este es un correo automático del Sistema de Gestión de Solicitudes.</p>
          `,
          text: `
Estado de Solicitud Actualizado

Ticket #${ticket.id}
Título: ${ticket.titulo}
Estado anterior: ${oldStatus}
Estado nuevo: ${ticket.estado}
Fecha de actualización: ${new Date(ticket.fecha_actualizacion).toLocaleString("es-ES")}

Este es un correo automático del Sistema de Gestión de Solicitudes.
          `,
        }),
      );

      await Promise.all(emailPromises);
      console.log(
        `Ticket status change notification sent to ${recipients.length} recipients`,
      );
    } catch (error) {
      console.error("Error sending ticket status changed email:", error);
    }
  },

  /**
   * Send email notification when a response is added to a ticket
   * Notifies the creator and the assigned user (if not the responder)
   */
  async sendResponseAddedEmail(
    ticketId: number,
    ticketTitle: string,
    responseText: string,
    responder: SessionUser,
    creatorId: number,
    assignedUserId: number | null,
  ): Promise<void> {
    try {
      const recipients: User[] = [];

      // Notify creator if they're not the responder
      if (creatorId !== responder.id) {
        const creator = await getUserById(creatorId);
        if (creator) {
          recipients.push(creator);
        }
      }

      // Notify assigned user if they exist, are not the responder, and are different from creator
      if (
        assignedUserId &&
        assignedUserId !== responder.id &&
        assignedUserId !== creatorId
      ) {
        const assignedUser = await getUserById(assignedUserId);
        if (assignedUser) {
          recipients.push(assignedUser);
        }
      }

      if (recipients.length === 0) {
        console.log("No recipients for response notification");
        return;
      }

      const emailPromises = recipients.map((recipient) =>
        transporter.sendMail({
          from: SMTP_FROM,
          to: recipient.email,
          subject: `Nueva Respuesta en #${ticketId}: ${ticketTitle}`,
          html: `
            <h2>Nueva Respuesta en Solicitud</h2>
            <p><strong>Ticket #${ticketId}</strong></p>
            <p><strong>Título:</strong> ${ticketTitle}</p>
            <p><strong>Respuesta de:</strong> ${responder.nombre} (${responder.rol_nombre})</p>
            <p><strong>Contenido:</strong></p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
              ${responseText}
            </div>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Este es un correo automático del Sistema de Gestión de Solicitudes.</p>
          `,
          text: `
Nueva Respuesta en Solicitud

Ticket #${ticketId}
Título: ${ticketTitle}
Respuesta de: ${responder.nombre} (${responder.rol_nombre})

Contenido:
${responseText}

Fecha: ${new Date().toLocaleString("es-ES")}

Este es un correo automático del Sistema de Gestión de Solicitudes.
          `,
        }),
      );

      await Promise.all(emailPromises);
      console.log(
        `Response notification sent to ${recipients.length} recipients`,
      );
    } catch (error) {
      console.error("Error sending response added email:", error);
    }
  },
};

