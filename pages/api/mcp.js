import { server } from "../../lib/mcp/server";

export default async function handler(req, res) {
  const cidade = req.query.cidade || req.body?.cidade;
  const data_inicio = req.query.data_inicio || req.body?.data_inicio;
  const data_fim = req.query.data_fim || req.body?.data_fim;
  const field = req.query.field || req.body?.field;
  const functionName =
    req.query.functionName || req.body?.functionName || "consulta_clima_cidade";
  if (!cidade) {
    return res.status(400).json({ error: "Parâmetro 'cidade' é obrigatório." });
  }

  try {
    const toolCallback = server._registeredTools[functionName]?.callback;
    if (!toolCallback) {
      return res
        .status(400)
        .json({ error: `Função '${functionName}' não registrada.` });
    }

    const result = await toolCallback({
      cidade,
      data_inicio,
      data_fim,
      field,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
