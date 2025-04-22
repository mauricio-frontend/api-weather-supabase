import { server } from "../../lib/mcp/server";

export default async function handler(req, res) {
  const cidade = req.query.cidade || req.body?.cidade;
  const data_inicio = req.query.data_inicio || req.body?.data_inicio;
  const data_fim = req.query.data_fim || req.body?.data_fim;

  if (!cidade) {
    return res.status(400).json({ error: "Parâmetro 'cidade' é obrigatório." });
  }

  try {
    const result = await server._registeredTools[
      "consulta-clima-cidade"
    ].callback({
      cidade,
      data_inicio,
      data_fim,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
