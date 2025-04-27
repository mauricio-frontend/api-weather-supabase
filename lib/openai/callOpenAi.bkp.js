import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function chamarConsultaClimaViaOpenAI(userMessage) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 150,
    messages: [
      {
        role: "system",
        content: "Você é um assistente que ajuda o usuário a consultar o clima de cidades.",
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "consulta-clima-cidade",
          description: "Consulta o clima de uma cidade em um intervalo de datas.",
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
    tool_choice: "auto",
  });

  const toolCall = response.choices[0].message.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("Nenhuma função foi chamada pela IA.");
  }

  const args = JSON.parse(toolCall.function.arguments);

  return args; // { cidade, data_inicio, data_fim }
}
