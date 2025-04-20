export async function consultaClima(cidade, baseUrl) {
  const resolvedBaseUrl =
    baseUrl || process.env.HOST_URL || "http://localhost:3000";

  const url = `${resolvedBaseUrl}/api/consultaSupabase?cidade=${encodeURIComponent(
    cidade
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao consultar API: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
