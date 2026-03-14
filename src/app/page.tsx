"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {

  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const joinRoom = () => {
    if (!roomId) return;
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">

      <h1 className="text-3xl font-bold">
        WebRTC Video Chat
      </h1>

      <input
        className="border p-2 rounded"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button
        onClick={joinRoom}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Join Room
      </button>

    </div>
  );
}