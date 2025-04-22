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

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao consultar API: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.data || data.data.length === 0) {
      throw new Error(
        "Nenhum dado de clima encontrado para a cidade e intervalo de datas informados."
      );
    }

    return data;
  } catch (error) {
    throw new Error(`Erro ao consultar o clima: ${error.message}`);
  }
}
