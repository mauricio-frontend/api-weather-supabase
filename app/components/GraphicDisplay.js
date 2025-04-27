"use client";

import { ResponsiveLine } from "@nivo/line";

const GraphicDisplay = ({ dados }) => {
  const chartData = [
    {
      id: "Média diária",
      data: dados
        ? dados.map((d) => ({
            x: d.date,
            y: Number(d.media) || 0,
          }))
        : [],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div style={{ width: "100%", height: 400, overflowX: "auto" }}>
        <div style={{ width: Math.max(800, dados.length * 80), height: 400 }}>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 45,
              legend: "Data",
              legendOffset: 60,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Temperatura Média (°C)",
              legendOffset: -50,
              legendPosition: "middle",
            }}
            colors={{ scheme: "category10" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={3}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableSlices="x"
            tooltip={({ point }) => {
              const formattedValue = point.data.y.toFixed(2);
              return (
                <div className="bg-gray-800 text-white p-2 rounded-lg">
                  <strong>{point.data.x}</strong>: {formattedValue} °C
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GraphicDisplay;
