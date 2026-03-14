"use client";

import { useEffect, useRef } from "react";

export default function VideoPlayer({ stream }: { stream: MediaStream | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-96 rounded-lg border"
      data-test-id="local-video"
    />
  );
}