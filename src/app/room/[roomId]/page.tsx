"use client";
import { useEffect, useState, useRef } from "react";
import { use } from "react";
import { socket } from "../../../lib/socket";
import VideoPlayer from "../../../components/VideoPlayer";
import { createPeerConnection } from "../../../lib/webrtc";
import Controls from "../../../components/Controls";
import ChatPanel from "../../../components/ChatPanel";
export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {

  const { roomId } = use(params);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});

  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});

  useEffect(() => {

    async function startMedia() {

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      // join room
      if (socket.connected) {
        socket.emit("join-room", roomId);
      } else {
        socket.on("connect", () => {
          console.log("Connected:", socket.id);
          socket.emit("join-room", roomId);
        });
      }

      // NEW USER JOINED
      socket.on("user-joined", async (userId: string) => {

        console.log("New user joined:", userId);

        if (!socket.id || socket.id > userId) return;

        const pc = createPeerConnection(
          mediaStream,
          (incomingStream) => {
            setRemoteStreams((prev) => ({
              ...prev,
              [userId]: incomingStream
            }));
          },
          (candidate) => {
            socket.emit("ice-candidate", {
              candidate,
              target: userId
            });
          }
        );

        peerConnections.current[userId] = pc;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
          offer,
          target: userId
        });

      });

      // RECEIVE OFFER
      socket.on("offer", async ({ offer, from }) => {

        const pc = createPeerConnection(
          mediaStream,
          (incomingStream) => {
            setRemoteStreams((prev) => ({
              ...prev,
              [from]: incomingStream
            }));
          },
          (candidate) => {
            socket.emit("ice-candidate", {
              candidate,
              target: from
            });
          }
        );

        peerConnections.current[from] = pc;

        await pc.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          answer,
          target: from
        });

      });

      // RECEIVE ANSWER
      socket.on("answer", async ({ answer, from }) => {

        const pc = peerConnections.current[from];
        if (!pc) return;

        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }

      });

      // RECEIVE ICE
      socket.on("ice-candidate", async ({ candidate, from }) => {

        const pc = peerConnections.current[from];
        if (!pc) return;

        try {
          await pc.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("ICE error:", err);
        }

      });

    }

    startMedia();

    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };

  }, [roomId]);

  return (
  <div className="flex justify-center items-start h-screen gap-8 p-6">

    {/* VIDEO AREA */}
    <div className="flex flex-col items-center gap-6">

      <h1 className="text-xl font-bold">
        Room: {roomId}
      </h1>

      <VideoPlayer stream={stream} />

{/* Call Controls */}
<Controls stream={stream} />

      <div
        className="flex gap-4"
        data-test-id="remote-video-container"
      >
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <video
            key={id}
            autoPlay
            playsInline
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
            className="w-96 rounded-lg border"
          />
        ))}
      </div>

    </div>

    {/* CHAT PANEL */}
    <ChatPanel roomId={roomId} />

  </div>
);
}