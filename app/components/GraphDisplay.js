import GraphicDisplay from "./GraphicDisplay";

export default function GraphDisplay({ weatherData = [] }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-medium mb-2">Gráficos gerados</h2>
      <div className="text-gray-500">
        <GraphicDisplay dados={weatherData} />
      </div>
    </div>
  );
}
