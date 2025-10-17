import express, { Router } from "express";

import { aiController } from "../controllers/aiController.js";
import { requireAuth } from "../middleware/auth.js";

const router: Router = express.Router();

/**
 * @swagger
 * /api/tickets/{ticketId}/ai-suggestions:
 *   get:
 *     summary: Get AI-powered suggestions for a ticket (Soporte/Admin only)
 *     tags: [AI Suggestions]
 *     description: Generates AI-powered suggestions for resolving a ticket. Only available to Soporte and Administrador users.
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: AI suggestions for the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: string
 *                   description: AI-generated suggestions for resolving the ticket
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Only Soporte and Administrador users can access AI suggestions
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
 *       500:
 *         description: AI service error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/:ticketId/ai-suggestions",
  requireAuth,
  aiController.getSuggestions,
);

export default router;

