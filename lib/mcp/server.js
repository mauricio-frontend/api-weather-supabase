import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { consultaClima } from "./consultaClima.js";

const server = new McpServer({
  name: "ClimaBot",
  version: "1.0.0",
});

server.tool(
  "consulta-clima-cidade",
  { cidade: z.string() },
  async ({ cidade }) => {
    try {
      const baseUrl = process.env.HOST_URL || "http://localhost:3000";
      const data = await consultaClima(cidade, baseUrl);

      return {
        content: [
          {
            type: "text",
            text: `Clima de ${cidade}: ${JSON.stringify(data)}`,
          },
        ],
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
