import { createClient } from '@supabase/supabase-js';

function normalizarCidade(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { cidade, data_inicio, data_fim } = req.query;

    let stationIds = [];
    let stationsData = [];

    if (cidade) {
      const cidadeNormalizada = normalizarCidade(cidade);

      const { data: stationData, error: stationError } = await supabase
        .from('stations')
        .select('id_station, city_station, state')
        .ilike('city_station', `%${cidadeNormalizada}%`);

      if (stationError || !stationData || stationData.length === 0) {
        return res.status(404).json({ error: 'Nenhuma estação encontrada para essa cidade' });
      }

      stationIds = stationData.map(estacao => estacao.id_station);
      stationsData = stationData;
    }

    let query = supabase
      .from('weather_data')
      .select('*');

    if (stationIds.length > 0) {
      query = query.in('station_code', stationIds);
    }

    if (data_inicio) {
      query = query.gte('date', data_inicio);
    }

    if (data_fim) {
      query = query.lte('date', data_fim);
    }

    const { data: weatherData, error: weatherError } = await query;

    if (weatherError) {
      return res.status(400).json({ error: weatherError.message });
    }

    const resultadoFinal = weatherData.map((weatherRecord) => {
      const stationInfo = stationsData.find(
        (station) => station.id_station === weatherRecord.station_code
      );

      return {
        ...weatherRecord, // Dados do clima
        city_station: stationInfo ? stationInfo.city_station : null,
        state: stationInfo ? stationInfo.state : null,
      };
    });

    return res.status(200).json(resultadoFinal);
  } catch (err) {
    console.error('Erro no servidor:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
