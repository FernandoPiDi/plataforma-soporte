"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TicketStatusBadge from "@/components/tickets/TicketStatusBadge";
import AISuggestions from "@/components/tickets/AISuggestions";
import { ticketAPI, responseAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, UserPlus } from "lucide-react";

interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: "abierta" | "en progreso" | "cerrada";
  creada_por_nombre?: string;
  creada_por_email?: string;
  asignada_a_nombre?: string;
  asignada_a_email?: string;
  asignada_a_id?: number | null;
  fecha_creacion: string;
}

interface Response {
  id: number;
  respuesta: string;
  creada_por_nombre?: string;
  fecha_creacion: string;
}

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const ticketId = parseInt(params.id as string);

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newResponse, setNewResponse] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadTicket();
    loadResponses();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketAPI.getById(ticketId);
      setTicket(data.ticket);
      setNewStatus(data.ticket.estado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar ticket");
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async () => {
    try {
      const data = await responseAPI.getByTicketId(ticketId);
      setResponses(data.responses);
    } catch (err) {
      console.error("Error loading responses:", err);
    }
  };

  const handleAssign = async () => {
    try {
      await ticketAPI.assign(ticketId);
      await loadTicket();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar ticket");
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === ticket?.estado) return;

    try {
      setIsUpdatingStatus(true);
      await ticketAPI.updateStatus(ticketId, newStatus);
      await loadTicket();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar estado");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    try {
      setIsSubmittingResponse(true);
      await responseAPI.create(ticketId, newResponse);
      setNewResponse("");
      await loadResponses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar respuesta");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setNewResponse(suggestion);
  };

  if (loading) {
    return (
      <div className="text-center py-8">Cargando ticket...</div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Ticket no encontrado</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }

  const canAssign = user?.rol_nombre !== "Cliente" && !ticket.asignada_a_id;
  const canUpdateStatus = user?.rol_nombre !== "Cliente";
  const canRespond = user?.rol_nombre !== "Cliente";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{ticket.titulo}</CardTitle>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Creado por: {ticket.creada_por_nombre} ({ticket.creada_por_email})</p>
                <p>Fecha: {new Date(ticket.fecha_creacion).toLocaleString("es-ES")}</p>
                {ticket.asignada_a_nombre && (
                  <p>Asignado a: {ticket.asignada_a_nombre}</p>
                )}
              </div>
            </div>
            <TicketStatusBadge status={ticket.estado} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Descripción:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.descripcion}</p>
            </div>

            {canAssign && (
              <div className="pt-4 border-t">
                <Button onClick={handleAssign}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Asignarme este ticket
                </Button>
              </div>
            )}

            {canUpdateStatus && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Actualizar Estado:</h3>
                <div className="flex items-center gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abierta">Abierta</SelectItem>
                      <SelectItem value="en progreso">En Progreso</SelectItem>
                      <SelectItem value="cerrada">Cerrada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={isUpdatingStatus || newStatus === ticket.estado}
                  >
                    {isUpdatingStatus ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Respuestas ({responses.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {responses.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              No hay respuestas todavía
            </p>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div
                  key={response.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm">
                      {response.creada_por_nombre}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(response.fecha_creacion).toLocaleString("es-ES")}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {response.respuesta}
                  </p>
                </div>
              ))}
            </div>
          )}

          {canRespond && (
            <div className="pt-4 border-t space-y-4">
              <AISuggestions
                ticketId={ticketId}
                onSuggestionSelect={handleSuggestionSelect}
              />

              <form onSubmit={handleAddResponse}>
                <h3 className="font-semibold mb-2">Agregar Respuesta:</h3>
                <Textarea
                  placeholder="Escribe tu respuesta..."
                  rows={4}
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  required
                />
                <div className="mt-2 flex justify-end">
                  <Button type="submit" disabled={isSubmittingResponse}>
                    {isSubmittingResponse ? "Enviando..." : "Enviar Respuesta"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

