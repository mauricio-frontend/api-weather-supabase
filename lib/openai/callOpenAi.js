import { CohereClientV2 } from "cohere-ai";
import { SYSTEM_PROMPT_CLIMA } from "./systemPrompt";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

export async function chamarConsultaClimaViaCohere(userMessage) {
  const response = await cohere.chat({
    model: "command-r-plus",
    tools: [
      {
        type: "function",
        function: {
          name: "consulta_clima_cidade",
          description:
            "Consulta o clima de uma cidade em um intervalo de datas.",
          parameters: {
            type: "object",
            properties: {
              cidade: { type: "string", description: "Nome da cidade" },
              data_inicio: {
                type: "string",
                description: "Data inicial no formato YYYY-MM-DD",
              },
              data_fim: {
                type: "string",
                description: "Data final no formato YYYY-MM-DD",
              },
            },
            required: ["cidade"],
          },
        },
      },
    ],
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT_CLIMA,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const toolCall = response.message?.toolCalls?.[0];
  if (!toolCall) {
    throw new Error("Nenhuma chamada de função foi realizada.");
  }

  const args = JSON.parse(toolCall.function.arguments);
  const { cidade, data_inicio, data_fim } = args;

  return { cidade, data_inicio, data_fim };
}
