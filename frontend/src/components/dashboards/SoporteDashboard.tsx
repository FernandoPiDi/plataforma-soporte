"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketCard from "@/components/tickets/TicketCard";
import { ticketAPI } from "@/lib/api";

interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "abierta" | "en progreso" | "cerrada";
  creada_por_nombre?: string;
  asignada_a_nombre?: string;
  asignada_a_id?: number | null;
  fecha_creacion: string;
}

export default function SoporteDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketAPI.getAll();
      setTickets(data.tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-900 dark:text-gray-100">Cargando panel de soporte...</div>;
  }

  const assignedTickets = tickets.filter((t) => t.asignada_a_id !== null);
  const unassignedTickets = tickets.filter((t) => t.asignada_a_id === null && t.estado === "abierta");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Soporte</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gestiona las solicitudes de soporte
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
              Tickets No Asignados ({unassignedTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unassignedTickets.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No hay tickets sin asignar
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unassignedTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
              Mis Tickets Asignados ({assignedTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedTickets.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No tienes tickets asignados
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignedTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

