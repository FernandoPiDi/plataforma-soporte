"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TicketCard from "@/components/tickets/TicketCard";
import { ticketAPI } from "@/lib/api";
import { Plus } from "lucide-react";

interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "abierta" | "en progreso" | "cerrada";
  creada_por_nombre?: string;
  asignada_a_nombre?: string;
  fecha_creacion: string;
}

export default function ClienteDashboard() {
  const router = useRouter();
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
    return <div className="text-center py-8 text-gray-900 dark:text-gray-100">Cargando tickets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mis Tickets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus solicitudes de soporte
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/tickets/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Ticket
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No tienes tickets creados todavía
            </p>
            <Button onClick={() => router.push("/dashboard/tickets/new")}>
              Crear tu primer ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

