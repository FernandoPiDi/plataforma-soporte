import express, { Router } from "express";

import { responseController } from "../controllers/responseController.js";
import { requireAuth } from "../middleware/auth.js";

const router: Router = express.Router();

/**
 * @swagger
 * /api/tickets/{ticketId}/responses:
 *   post:
 *     summary: Create a response to a ticket
 *     tags: [Responses]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuesta
 *             properties:
 *               respuesta:
 *                 type: string
 *                 description: Response content
 *     responses:
 *       201:
 *         description: Response created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 response:
 *                   $ref: '#/components/schemas/Response'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - No permission to respond to this ticket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  "/:ticketId/responses",
  requireAuth,
  responseController.createResponse,
);

/**
 * @swagger
 * /api/tickets/{ticketId}/responses:
 *   get:
 *     summary: Get all responses for a ticket
 *     tags: [Responses]
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: List of responses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Response'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - No permission to view responses for this ticket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/:ticketId/responses",
  requireAuth,
  responseController.getResponsesByTicketId,
);

export default router;
