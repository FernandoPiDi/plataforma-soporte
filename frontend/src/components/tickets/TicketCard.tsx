import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TicketStatusBadge from "./TicketStatusBadge";

interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "abierta" | "en progreso" | "cerrada";
  creada_por_nombre?: string;
  asignada_a_nombre?: string;
  fecha_creacion: string;
}

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const fechaCreacion = new Date(ticket.fecha_creacion).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/dashboard/tickets/${ticket.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{ticket.titulo}</CardTitle>
              <CardDescription className="mt-1 text-gray-600 dark:text-gray-400">
                Creado el {fechaCreacion}
                {ticket.creada_por_nombre && ` por ${ticket.creada_por_nombre}`}
              </CardDescription>
            </div>
            <TicketStatusBadge status={ticket.estado} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {ticket.descripcion}
          </p>
          {ticket.asignada_a_nombre && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Asignado a: {ticket.asignada_a_nombre}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

