import { consultaClima } from "../../lib/mcp/consultaClima";

export default async function handler(req, res) {
  const cidade = req.query.cidade || req.body?.cidade;

  if (!cidade) {
    return res.status(400).json({ error: "Parâmetro 'cidade' é obrigatório." });
  }

  try {
    const baseUrl = `${req.headers["x-forwarded-proto"] || "http"}://${
      req.headers.host
    }`;
    const data = await consultaClima(cidade, baseUrl);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
