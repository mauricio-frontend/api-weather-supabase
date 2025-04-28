import { CohereClientV2 } from "cohere-ai";
import { SYSTEM_PROMPT_CLIMA, SYSTEM_PROMPT_UMIDADE } from "./systemPrompt";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

const tools = [
  {
    name: "consulta_clima_cidade",
    description: "Consulta o clima de uma cidade em um intervalo de datas.",
    prompt: SYSTEM_PROMPT_CLIMA,
    field: "temp_avg",
    keywords: ["clima", "temperatura"],
  },
  {
    name: "consulta_umidade_cidade",
    description: "Consulta a umidade de uma cidade em um intervalo de datas.",
    prompt: SYSTEM_PROMPT_UMIDADE,
    field: "hum_avg",
    keywords: ["umidade"],
  },
];

const detectarFerramenta = async (userMessage) => {
  const response = await cohere.chat({
    model: "command-r-plus",
    messages: [
      {
        role: "system",
        content: `
Você é um assistente que só responde o nome da ferramenta mais adequada.

Com base na pergunta do usuário, responda somente:

- "consulta_clima_cidade" se a pergunta for sobre clima, tempo, temperatura, sol, chuva, previsão.
- "consulta_umidade_cidade" se a pergunta for sobre umidade, ar seco, umidade relativa.

A resposta deve ser apenas o nome da função, nada mais.
        `.trim(),
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const toolChoice = response.message.content[0].text;
  return toolChoice;
};

export async function chamarConsultaClimaViaCohere(userMessage) {
  let selectedTool = null;
  const toolChoice = await detectarFerramenta(userMessage);

  for (let tool of tools) {
    if (tool.name === toolChoice) {
      selectedTool = tool;
      break;
    }
  }

  if (!selectedTool) {
    throw new Error(
      "Não foi possível identificar o tipo de consulta. Por favor, forneça mais detalhes."
    );
  }

  const { name, prompt, field } = selectedTool;

  const response = await cohere.chat({
    model: "command-r-plus",
    tools: [
      {
        type: "function",
        function: {
          name,
          description: selectedTool.description,
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
              }
            },
            required: ["cidade"],
          },
        },
      },
    ],
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const toolCall = response.message?.toolCalls?.[0];
  const toolPlan = response.message?.toolPlan;

  pusher.trigger('my-channel', 'my-event', {
    message: toolPlan,
  });

  if (!toolCall) {
    throw new Error("Nenhuma chamada de função foi realizada.");
  }

  const args = JSON.parse(toolCall.function.arguments);
  const { cidade, data_inicio, data_fim } = args;

  return {
    cidade,
    data_inicio,
    data_fim,
    functionName: toolCall.function.name,
    field,
  };
}
