import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { consultaClima } from "./consultaClima.js";

const server = new McpServer({
  name: "ClimaBot",
  version: "1.0.0",
});

function criarToolConsulta(nomeTool, field, tipoDescricao) {
  server.tool(
    nomeTool,
    {
      cidade: z.string(),
      data_inicio: z.string().optional(),
      data_fim: z.string().optional(),
    },
    async ({ cidade, data_inicio, data_fim }) => {
      try {
        const baseUrl = process.env.HOST_URL || "http://localhost:3000";
        const data = await consultaClima(
          cidade,
          baseUrl,
          data_inicio,
          data_fim,
          field
        );

        if (!data.data || data.data.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `Desculpe, não encontramos dados de ${tipoDescricao} para a cidade de ${cidade} no período de ${
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
                `${tipoDescricao} para a cidade de ${cidade} entre ${
                  data_inicio || "início"
                } e ${data_fim || "hoje"} retornado com sucesso.`,
            },
          ],
          data: data.data,
          functionName: nomeTool,
          field,
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Erro ao consultar ${tipoDescricao}: ${err.message}`,
            },
          ],
        };
      }
    }
  );
}

criarToolConsulta("consulta_clima_cidade", "temp_avg", "o clima médio");

criarToolConsulta("consulta_umidade_cidade", "hum_avg", "a umidade média");

export { server };
