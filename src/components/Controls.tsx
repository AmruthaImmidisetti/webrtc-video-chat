"use client";

import { useState } from "react";

export default function Controls({
  stream,
}: {
  stream: MediaStream | null;
}) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const toggleMic = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setMicOn(!micOn);
  };

  const toggleCamera = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setCameraOn(!cameraOn);
  };

  const hangUp = () => {
    if (!stream) return;

    stream.getTracks().forEach((track) => track.stop());

    window.location.href = "/";
  };

  return (
    <div className="flex gap-4 mt-4">

      <button
        onClick={toggleMic}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {micOn ? "Mute Mic" : "Unmute Mic"}
      </button>

      <button
        onClick={toggleCamera}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>

      <button
        onClick={hangUp}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Hang Up
      </button>

    </div>
  );
}