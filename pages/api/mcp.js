import { server } from "../../lib/mcp/server";

export default async function handler(req, res) {
  const cidade = req.query.cidade || req.body?.cidade;

  if (!cidade) {
    return res.status(400).json({ error: "Parâmetro 'cidade' é obrigatório." });
  }

  try {
    const result = await server._registeredTools[
      "consulta-clima-cidade"
    ].callback({ cidade });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
