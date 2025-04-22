"use client";

import { useState } from "react";
import ChatBot from "./components/ChatBot";
import GraphDisplay from "./components/GraphDisplay";

function groupByDay(dados) {
  const agrupado = {};

  dados.forEach((item) => {
    const data = new Date(item.date).toISOString().split("T")[0];

    if (!agrupado[data]) {
      agrupado[data] = { soma: 0, count: 0 };
    }

    agrupado[data].soma += item.temp_avg; // Supondo que o campo seja 'temperatura'
    agrupado[data].count += 1;
  });

  return Object.entries(agrupado).map(([data, { soma, count }]) => ({
    date: data,
    temp_avg: soma / count,
  }));
}

export default function Home() {
  const [weatherData, setWeatherData] = useState([]);
  const handleChartData = (data) => {
    const groupedItems = groupByDay(data || []);
    const lastTenDays = groupedItems;

    setWeatherData(lastTenDays);
  };

  return (
    <div className="flex flex-col gap-6">
      <ChatBot onUpdateData={handleChartData} />
      <GraphDisplay weatherData={weatherData} />
    </div>
  );
}
