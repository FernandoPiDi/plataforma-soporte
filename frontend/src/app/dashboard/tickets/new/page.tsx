"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketAPI } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

export default function NewTicketPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await ticketAPI.create(titulo, descripcion);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Ticket</h1>
        <p className="text-gray-600 mt-1">
          Crea una nueva solicitud de soporte
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Ticket</CardTitle>
          <CardDescription>
            Describe tu problema o consulta detalladamente
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Breve descripción del problema"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el problema en detalle..."
                rows={8}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <div className="px-6 pb-6 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Ticket"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

