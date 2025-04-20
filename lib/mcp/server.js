// lib/mcp/server.js (usar .ts para o SDK funcionar corretamente)
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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
      const baseUrl = process.env.HOST_URL || "http://localhost:3000"; // define dinamicamente
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

// Exemplo adicional opcional
server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Olá, ${name}!`,
      },
    ],
  })
);

// Inicia o servidor MCP via stdin/stdout
const transport = new StdioServerTransport();
await server.connect(transport);
