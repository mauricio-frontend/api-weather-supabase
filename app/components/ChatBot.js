"use client";

import { useState } from "react";
import MessageInput from "./MessageInput";

async function chamarConsultaClimaViaCohere(text) {
  try {
    const response = await fetch("/api/interpretar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: text }),
    });

    if (!response.ok) {
      throw new Error("Erro ao interpretar a mensagem com Cohere.");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Erro ao chamar o Cohere:", error);
    return null;
  }
}

export default function ChatBot({ onUpdateData }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Me dia uma cidade e se você deseja consultar umidade ou clima com um período definido.",
    },
  ]);

  const handleSend = async (text) => {
    if (!text) return;
    onUpdateData([])

    try {
      const { mensagem, dados } = await chamarConsultaClimaViaCohere(text);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: mensagem || "Consulta concluída.",
        },
      ]);

      if (dados) onUpdateData(dados);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erro ao buscar o clima. Tente novamente." },
      ]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
      <div className="h-60 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-3 rounded-lg max-w-xs ${
              msg.sender === "bot"
                ? "bg-gray-200 self-start"
                : "bg-blue-200 self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
}
