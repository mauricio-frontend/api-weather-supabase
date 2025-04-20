
import ChatBot from "./components/ChatBot";
import GraphDisplay from "./components/GraphDisplay";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <ChatBot />
      <GraphDisplay />
    </div>
  );
}
