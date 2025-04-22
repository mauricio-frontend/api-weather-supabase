export async function consultaClima(cidade, baseUrl, data_inicio, data_fim) {
  const resolvedBaseUrl =
    baseUrl || process.env.HOST_URL || "http://localhost:3000";

  const params = new URLSearchParams({ cidade });

  if (data_inicio) {
    params.append("data_inicio", data_inicio);
  }

  if (data_fim) {
    params.append("data_fim", data_fim);
  }

  const url = `${resolvedBaseUrl}/api/consultaSupabase?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao consultar API: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
