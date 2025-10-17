import { Badge } from "@/components/ui/badge";

interface TicketStatusBadgeProps {
  status: "abierta" | "en progreso" | "cerrada";
}

export default function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const variants = {
    abierta: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    "en progreso": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    cerrada: "bg-green-100 text-green-800 hover:bg-green-100",
  };

  const labels = {
    abierta: "Abierta",
    "en progreso": "En Progreso",
    cerrada: "Cerrada",
  };

  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}

