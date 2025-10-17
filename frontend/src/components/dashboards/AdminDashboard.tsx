"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TicketCard from "@/components/tickets/TicketCard";
import TicketsByStatusChart from "@/components/charts/TicketsByStatusChart";
import TicketsByClientChart from "@/components/charts/TicketsByClientChart";
import TicketsTimelineChart from "@/components/charts/TicketsTimelineChart";
import { ticketAPI } from "@/lib/api";

interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "abierta" | "en progreso" | "cerrada";
  creada_por_nombre?: string;
  asignada_a_nombre?: string;
  fecha_creacion: string;
}

interface TicketStats {
  byStatus: Array<{ estado: string; count: string }>;
  byClient: Array<{ client_name: string; count: string }>;
  timeline: Array<{ date: string; count: string }>;
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTickets();
    loadStats();
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

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await ticketAPI.getStats();
      setStats(data.stats);
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-900 dark:text-gray-100">Cargando panel de administración...</div>;
  }

  const openTickets = tickets.filter((t) => t.estado === "abierta");
  const inProgressTickets = tickets.filter((t) => t.estado === "en progreso");
  const closedTickets = tickets.filter((t) => t.estado === "cerrada");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Administración</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vista global de todos los tickets del sistema
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tickets Abiertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{openTickets.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              En Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressTickets.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Cerrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{closedTickets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reportes Gráficos */}
      {statsLoading ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando gráficos...</div>
      ) : stats ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reportes Gráficos</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tickets por Estado */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Distribución por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.byStatus.length > 0 ? (
                  <TicketsByStatusChart data={stats.byStatus} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay datos disponibles</p>
                )}
              </CardContent>
            </Card>

            {/* Tickets por Cliente */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Top 10 Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.byClient.length > 0 ? (
                  <TicketsByClientChart data={stats.byClient} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay datos disponibles</p>
                )}
              </CardContent>
            </Card>

            {/* Timeline de Tickets */}
            <Card className="md:col-span-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Tendencia de Tickets (Últimos 30 días)</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.timeline.length > 0 ? (
                  <TicketsTimelineChart data={stats.timeline} />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No hay datos disponibles</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {/* All Tickets */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
            Todos los Tickets ({tickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No hay tickets en el sistema
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

