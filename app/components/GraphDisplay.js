import GraphicDisplay from "./GraphicDisplay";

export default function GraphDisplay({ weatherData = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Gráficos gerados</h2>
      <div className="text-gray-600">
        <GraphicDisplay dados={weatherData} />
      </div>
    </div>
  );
}
