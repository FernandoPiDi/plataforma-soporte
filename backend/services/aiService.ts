import { ChatOpenAI } from "@langchain/openai";

interface AISuggestion {
  id: number;
  text: string;
}

export const aiService = {
  async generateSuggestions(
    titulo: string,
    descripcion: string,
  ): Promise<AISuggestion[]> {

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY no está configurada");
    }


    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
      openAIApiKey: apiKey,
    });

    const systemPrompt = `Eres un asistente de soporte técnico profesional. Tu trabajo es generar respuestas útiles y profesionales para solicitudes de soporte.

Genera exactamente 3 respuestas diferentes y profesionales en español para la siguiente solicitud.

Cada respuesta debe:
- Ser profesional y cortés
- Dirigirse directamente al problema mencionado
- Ofrecer una solución práctica o siguiente paso
- Ser concisa (2-4 oraciones)
- Tener un tono empático y servicial

Formatea tu respuesta como JSON con la siguiente estructura:
{
  "suggestions": [
    "Primera respuesta aquí...",
    "Segunda respuesta aquí...",
    "Tercera respuesta aquí..."
  ]
}`;

    const userPrompt = `Título de la solicitud: ${titulo}

Descripción: ${descripcion}`;

    try {
      const response = await model.invoke([
        ["system", systemPrompt],
        ["human", userPrompt],
      ]);

      const parsed = JSON.parse(response.content as string);

      const suggestions: AISuggestion[] = parsed.suggestions.map(
        (text: string, index: number) => ({
          id: index + 1,
          text: text.trim(),
        }),
      );

      return suggestions;
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      throw new Error("No se pudieron generar sugerencias de respuesta");
    }
  },
};

