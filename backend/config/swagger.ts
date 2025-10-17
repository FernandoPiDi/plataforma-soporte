import type { Options } from "swagger-jsdoc";

export const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Support Ticket System API",
      version: "1.0.0",
      description:
        "API documentation for the Support Ticket Management System. This API handles user authentication, ticket management, responses, and AI-powered suggestions.",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL ?? "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT authentication. Use the token received from login/register endpoints.",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            nombre: {
              type: "string",
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            rol_id: {
              type: "integer",
              description: "Role ID",
            },
            rol_nombre: {
              type: "string",
              description: "Role name",
              enum: ["Cliente", "Soporte", "Administrador"],
            },
            fecha_creacion: {
              type: "string",
              format: "date-time",
              description: "Account creation date",
            },
          },
        },
        Ticket: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Ticket ID",
            },
            titulo: {
              type: "string",
              description: "Ticket title",
            },
            descripcion: {
              type: "string",
              description: "Ticket description",
            },
            estado: {
              type: "string",
              description: "Ticket status",
              enum: ["Abierto", "En Progreso", "Resuelto", "Cerrado"],
            },
            prioridad: {
              type: "string",
              description: "Ticket priority",
              enum: ["Baja", "Media", "Alta"],
            },
            cliente_id: {
              type: "integer",
              description: "Client user ID",
            },
            asignado_a_id: {
              type: "integer",
              nullable: true,
              description: "Assigned support user ID",
            },
            fecha_creacion: {
              type: "string",
              format: "date-time",
              description: "Ticket creation date",
            },
            fecha_actualizacion: {
              type: "string",
              format: "date-time",
              description: "Last update date",
            },
          },
        },
        Response: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Response ID",
            },
            ticket_id: {
              type: "integer",
              description: "Associated ticket ID",
            },
            usuario_id: {
              type: "integer",
              description: "User who created the response",
            },
            contenido: {
              type: "string",
              description: "Response content",
            },
            fecha_creacion: {
              type: "string",
              format: "date-time",
              description: "Response creation date",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.ts"], // Path to the API routes
};

