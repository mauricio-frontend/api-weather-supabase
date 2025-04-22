"use client";

import { useState } from "react";
import MessageInput from "./MessageInput";

function formatDate(dateStr) {
  const [dd, mm, yyyy] = dateStr.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ChatBot({ onUpdateData }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Me diga uma cidade para consultar o clima.",
    },
  ]);

  const handleSend = async (text) => {
    console.log(text);
    if (!text) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Buscando dados..." },
    ]);

    const regex =
      /Quero\s+saber\s+o\s+clima\s+em\s+([\p{L}\s]+)\s+de\s+(\d{2}\/\d{2}\/\d{4})\s+até\s+(\d{2}\/\d{2}\/\d{4})/u;
    const match = text.match(regex);

    const cidade = match?.[1]?.trim();
    const data_inicio = match?.[2] ? formatDate(match[2]) : undefined;
    const data_fim = match?.[3] ? formatDate(match[3]) : undefined;

    if (!cidade) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Por favor, informe uma cidade válida." },
      ]);
      return;
    }

    try {
      const params = new URLSearchParams({ cidade });
      if (data_inicio) params.append("data_inicio", data_inicio);
      if (data_fim) params.append("data_fim", data_fim);

      const response = await fetch(`/api/mcp?${params.toString()}`);
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.content?.[0]?.text || "Consulta concluída.",
        },
      ]);

      if (data.data) onUpdateData(data.data);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Erro ao buscar o clima. Tente novamente." },
      ]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
      <div className="h-60 overflow-y-auto flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-2 rounded-md max-w-xs ${
              msg.sender === "bot"
                ? "bg-gray-100 self-start"
                : "bg-blue-100 self-end"
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
