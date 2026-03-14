export function createPeerConnection(
  stream: MediaStream,
  onTrack: (stream: MediaStream) => void,
  onIceCandidate: (candidate: RTCIceCandidate) => void
) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // Send our media tracks
  stream.getTracks().forEach((track) => {
    pc.addTrack(track, stream);
  });

  // When remote stream arrives
  let remoteStream = new MediaStream();

pc.ontrack = (event) => {
  event.streams[0].getTracks().forEach((track) => {
    remoteStream.addTrack(track);
  });

  onTrack(remoteStream);
};

  // Send ICE candidates to signaling server
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  return pc;
}