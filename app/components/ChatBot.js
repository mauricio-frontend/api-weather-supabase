"use client";

import { useState } from "react";
import MessageInput from "./MessageInput";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Olá! Me diga uma cidade ou data para consultar o clima.",
    },
  ]);

  const handleSend = (text) => {
    if (!text) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);

    // Simula resposta do bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text },
        { sender: "bot", text: "Buscando dados para: " + text },
      ]);
    }, 500);
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
