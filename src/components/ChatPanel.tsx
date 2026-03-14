"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function ChatPanel({ roomId }: { roomId: string }) {

  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);

  const [text, setText] = useState("");

  useEffect(() => {

    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat-message");
    };

  }, []);

  const sendMessage = () => {

    if (!text.trim()) return;

    socket.emit("chat-message", {
      message: text,
      roomId,
    });

    setText("");
  };

  return (
    <div className="w-80 h-[500px] border rounded-lg flex flex-col">

      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div key={index} className="text-sm mb-2">
            <b>{msg.sender.slice(0, 5)}:</b> {msg.message}
          </div>
        ))}
      </div>

      <div className="flex border-t">
        <input
          className="flex-1 p-2 outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="px-3 bg-blue-500 text-white"
        >
          Send
        </button>
      </div>

    </div>
  );
}