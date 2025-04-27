import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { consultaClima } from "./consultaClima.js";

const server = new McpServer({
  name: "ClimaBot",
  version: "1.0.0",
});

server.tool(
  "consulta-clima-cidade",
  {
    cidade: z.string(),
    data_inicio: z.string().optional(),
    data_fim: z.string().optional(),
    field: z.string().optional(),
  },
  async ({ cidade, data_inicio, data_fim, field = 'temp_avg' }) => {
    try {
      const baseUrl = process.env.HOST_URL || "http://localhost:3000";
      const data = await consultaClima(cidade, baseUrl, data_inicio, data_fim, field);

      if (!data.data || data.data.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Desculpe, não encontramos dados de clima para a cidade de ${cidade} no período de ${
                data_inicio || "início"
              } até ${data_fim || "hoje"}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text:
              data.mensagem ||
              `O clima médio para a cidade de ${cidade} de ${
                data_inicio || "o início"
              } a ${data_fim || "hoje"} foi retornado com sucesso.`,
          },
        ],
        data: data.data,
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `Erro ao consultar o clima: ${err.message}`,
          },
        ],
      };
    }
  }
);

export { server };
