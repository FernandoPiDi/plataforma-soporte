"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiAPI } from "@/lib/api";
import { Sparkles, Loader2 } from "lucide-react";

interface AISuggestion {
  id: number;
  text: string;
}

interface AISuggestionsProps {
  ticketId: number;
  onSuggestionSelect: (suggestion: string) => void;
}

export default function AISuggestions({
  ticketId,
  onSuggestionSelect,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await aiAPI.getSuggestions(ticketId);
      setSuggestions(data.suggestions);
      setHasGenerated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar sugerencias");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    onSuggestionSelect(suggestion.text);
  };

  if (!hasGenerated && !loading) {
    return (
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Button
              onClick={generateSuggestions}
              variant="outline"
              className="gap-2 border-purple-300 hover:bg-purple-100"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              Generar Respuestas con IA
            </Button>
            <p className="mt-2 text-xs text-gray-600">
              Obtén sugerencias de respuestas profesionales generadas por IA
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generando sugerencias...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-red-600 mb-3">{error}</p>
            <Button
              onClick={generateSuggestions}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Intentar de nuevo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Sugerencias de IA
          </CardTitle>
          <Button
            onClick={generateSuggestions}
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Regenerar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full text-left p-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-colors duration-200"
          >
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {suggestion.text}
            </p>
          </button>
        ))}
        <p className="text-xs text-gray-600 text-center pt-2">
          Haz clic en una sugerencia para usarla como respuesta
        </p>
      </CardContent>
    </Card>
  );
}

