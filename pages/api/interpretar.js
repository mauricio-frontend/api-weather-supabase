import { chamarConsultaClimaViaCohere } from "@/lib/openai/callOpenAi";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { mensagem } = req.body;
  if (!mensagem) {
    return res.status(400).json({ error: "Mensagem é obrigatória." });
  }

  try {
    const result = await chamarConsultaClimaViaCohere(mensagem);
    const { cidade, data_inicio, data_fim } = result;
    const params = new URLSearchParams({ cidade });

    if (data_inicio) params.append("data_inicio", data_inicio);
    if (data_fim) params.append("data_fim", data_fim);
    if (result.field) params.append("field", result.field);
    if (result.functionName) params.append("functionName", result.functionName);

    const baseUrl = process.env.HOST_URL || "http://localhost:3000";
    const finalUrl = `${baseUrl}/api/mcp?${params.toString()}`;

    const response = await fetch(finalUrl);
    const data = await response.json();

    if (data && data.data) {
      const mensagemFinal = data.content?.[0]?.text || "Consulta concluída.";

      pusher.trigger('my-channel', 'my-event', {
        message: mensagemFinal,
      });

      return res.status(200).json({
        dados: data.data,
      });
    } else {
      return res.status(404).json({
        error:
          "Não foi possível encontrar dados de clima para a cidade fornecida.",
      });
    }
  } catch (error) {
    pusher.trigger('my-channel', 'my-event', {
      message: error.message,
    });

    return res.status(500).json({
      error: "Erro ao processar a mensagem com IA.",
      detalhes: error.message,
    });
  }
}