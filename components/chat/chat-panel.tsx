"use client";

import { useState } from "react";

// Backend helper
async function sendMessage(message: string, mode: "chat" | "mcq" = "chat") {
  const response = await fetch("https://sciaticmz-studypilot.hf.space/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, mode }),
  });

  const data = await response.json();
  return data.response;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const aiReply = await sendMessage(input, "chat");
      setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 border rounded p-2 overflow-y-auto space-y-2 bg-white min-h-[60vh]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              msg.sender === "user" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
            }`}
          >
            <b>{msg.sender === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
        {loading && <p className="text-gray-500">AI is typing...</p>}
      </div>

      {/* Input */}
      <div className="flex mt-2">
