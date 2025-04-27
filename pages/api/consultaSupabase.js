import { createClient } from "@supabase/supabase-js";

function normalizarCidade(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { cidade, data_inicio, data_fim, field = 'temp_avg' } = req.query;

    let stationIds = [];
    let stationsData = [];

    if (cidade) {
      const cidadeNormalizada = normalizarCidade(cidade);

      // Consultando estações para a cidade
      const { data: stationData, error: stationError } = await supabase
        .from("stations")
        .select("id_station, city_station, state")
        .ilike("city_station", `%${cidadeNormalizada}%`);

      if (stationError || !stationData || stationData.length === 0) {
        return res
          .status(404)
          .json({ error: "Nenhuma estação encontrada para essa cidade" });
      }

      stationIds = stationData.map((estacao) => estacao.id_station);
      stationsData = stationData;
    }

    let query = supabase
      .from("weather_data")
      .select(`${field}, date, station_code`);

    if (stationIds.length > 0) {
      query = query.in("station_code", stationIds);
    }

    if (data_inicio) {
      query = query.gte("date", data_inicio);
    }

    if (data_fim) {
      query = query.lte("date", data_fim);
    }

    query.order("date", { ascending: true });

    const { data: weatherData, error: weatherError } = await query;

    if (weatherError) {
      return res.status(400).json({ error: weatherError.message });
    }

    if (!weatherData || weatherData.length === 0) {
      return res.status(404).json({
        error: `Nenhum dado de ${field} encontrado para as datas e cidade informadas.`,
      });
    }

    const medias = weatherData.map((item) => item[field]);
    const media =
      medias.reduce((sum, val) => sum + val, 0) / medias.length;

    const start_date = weatherData[0].date;
    const end_date = weatherData[weatherData.length - 1].date;

    const resultadoFinal = weatherData.map((weatherRecord) => {
      const stationInfo = stationsData.find(
        (station) => station.id_station === weatherRecord.station_code
      );

      return {
        ...weatherRecord,
        city_station: stationInfo ? stationInfo.city_station : null,
        state: stationInfo ? stationInfo.state : null,
      };
    });

    const result = {
      start_date,
      end_date,
      media: media.toFixed(2),
      mensagem: `O ${field} para a cidade de ${cidade} de ${start_date} a ${end_date} é de ${media.toFixed(2)} graus.`,
      data: resultadoFinal,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error("Erro no servidor:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
