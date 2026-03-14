# WebRTC Video Conferencing System

A real-time multi-user video conferencing application built using
**WebRTC**, **Next.js**, and **Socket.IO**. The system allows multiple
users to join a room, communicate through video/audio, and chat in
real-time.

------------------------------------------------------------------------

## Features

-   Multi-user video conferencing using WebRTC
-   Room-based communication
-   Real-time chat using Socket.IO
-   Microphone mute/unmute
-   Camera on/off toggle
-   Hang-up functionality
-   Mesh peer-to-peer connection topology
-   Docker containerized deployment

------------------------------------------------------------------------

## Tech Stack

**Frontend** - Next.js - React - TypeScript - Tailwind CSS

**Backend** - Node.js - Express - Socket.IO

**Real-Time Communication** - WebRTC

**Containerization** - Docker - Docker Compose

------------------------------------------------------------------------

# Project Structure

    webrtc-video-chat/
    │
    ├── src/
    │   ├── app/
    │   │   └── room/[roomId]/page.tsx
    │   │
    │   ├── components/
    │   │   ├── VideoPlayer.tsx
    │   │   ├── Controls.tsx
    │   │   └── ChatPanel.tsx
    │   │
    │   ├── lib/
    │   │   ├── socket.ts
    │   │   └── webrtc.ts
    │   │
    │   └── server/
    │       └── socketServer.ts
    │
    ├── Dockerfile
    ├── docker-compose.yml
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## Installation

Clone the repository:

git clone https://github.com/AmruthaImmidisetti/webrtc-video-chat.git

Navigate to the project directory:

cd webrtc-video-chat

Install dependencies:

npm install

------------------------------------------------------------------------

## Running the Application

Start the signaling server:

npm run socket

Start the Next.js application:

npm run dev

Open the browser:

http://localhost:3000

Enter a room ID and join the video conference.

------------------------------------------------------------------------

## Docker Setup

Build the Docker image:

docker-compose build

Run the application using Docker:

docker-compose up

The application will be available at:

http://localhost:3000

------------------------------------------------------------------------

## How It Works

1.  Users join a room using a unique room ID.
2.  The Socket.IO signaling server exchanges WebRTC offer/answer
    messages.
3.  Peer-to-peer connections are established using WebRTC.
4.  Media streams are shared directly between users.
5.  Chat messages are broadcast through the signaling server.

------------------------------------------------------------------------

## Demo

Users can: - Join a room - Start a video call - Send real-time
messages - Toggle microphone and camera - Leave the call

------------------------------------------------------------------------
