import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { Button } from "../../components/ui/Button";

const BACKEND_URL = "http://localhost:5000";

// Public free Google STUN servers to locate public IP routing configurations
const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const VideoCallRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // Component States for control states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Connecting to media devices...");

  // References to preserve objects across component re-renders
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // 1. Establish websocket channel targeting the backend signaling application
    socketRef.current = io(BACKEND_URL, { withCredentials: true });

    // 2. Setup audio/video streaming local capture pipeline
    const startMediaAndSignaling = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setStatusMessage("Waiting for peer to join...");

        // 3. Inform the socket infrastructure to assign this user into the target room
        socketRef.current?.emit("join-room", roomId);
      } catch (err) {
        console.error("Hardware Device Access Error:", err);
        setStatusMessage("Failed to access camera or microphone. Please grant permissions.");
      }
    };

    startMediaAndSignaling();

    /* ---------------- Signaling Listener Handlers ---------------- */

    // Inbound listener matching your backend's: socket.to(roomId).emit("user-joined", socket.id);
    socketRef.current.on("user-joined", async (partnerSocketId) => {
      setStatusMessage("Peer connected. Initializing call stream...");
      initiatePeerConnection();

      // Offerer maps out local definitions and generates a connection offer
      const offer = await peerConnectionRef.current?.createOffer();
      await peerConnectionRef.current?.setLocalDescription(offer);

      socketRef.current?.emit("offer", { roomId, offer });
    });

    // Inbound target payload match logic matching your backend's: socket.to(data.roomId).emit("offer", data);
    socketRef.current.on("offer", async (data: { offer: RTCSessionDescriptionInit }) => {
      if (!peerConnectionRef.current) initiatePeerConnection();

      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer);

      socketRef.current?.emit("answer", { roomId, answer });
      setStatusMessage("Call connected.");
    });

    // Inbound response mapping listener matching backend's: socket.to(data.roomId).emit("answer", data);
    socketRef.current.on("answer", async (data: { answer: RTCSessionDescriptionInit }) => {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
      setStatusMessage("Call connected.");
    });

    // Network structural paths matching backend's: socket.to(data.roomId).emit("ice-candidate", data);
    socketRef.current.on("ice-candidate", async (data: { candidate: RTCIceCandidateInit }) => {
      if (data.candidate && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding received ICE candidate:", e);
        }
      }
    });

    // Clear connection if peer disconnects natively or leaves room cleanly
    socketRef.current.on("user-left", () => {
      cleanRemoteStream();
      setStatusMessage("Peer disconnected from the session.");
    });

    return () => {
      // Cleanup hook when user navigates away or drops frame
      socketRef.current?.emit("leave-room", roomId);
      socketRef.current?.disconnect();
      peerConnectionRef.current?.close();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [roomId]);

  // Peer Connection Lifecycle Engine Factory
  const initiatePeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(ICE_SERVERS);

    // Append our local stream tracks to our outbound connection pipeline
    localStreamRef.current?.getTracks().forEach((track) => {
      peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
    });

    // Capture incoming structural tracks returned by remote peer connection profiles
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Forward local candidates out to peer via the socket signaling structure
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };
  };

  const cleanRemoteStream = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
  };

  /* ---------------- Toggle Actions ---------------- */

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        socketRef.current?.emit("toggle-audio", { roomId, isMuted: !audioTrack.enabled });
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        socketRef.current?.emit("toggle-video", { roomId, isVideoOff: !videoTrack.enabled });
      }
    }
  };

  const endCall = () => {
    socketRef.current?.emit("leave-room", roomId);
    navigate(-1); // Takes them back to their previous dashboard cleanly
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-gray-900 text-white rounded-xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-4 left-6 z-10">
        <h2 className="text-xl font-bold tracking-wide">Live Connection Room</h2>
        <p className="text-xs text-gray-400 font-mono mt-0.5">Status: {statusMessage}</p>
      </div>

      {/* Video Streaming Framework Windows Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 my-4 relative">
        {/* Local Stream View Block */}
        <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden border border-gray-700 shadow-md">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-xs font-medium backdrop-blur-sm">
            You (Local Stream)
          </div>
        </div>

        {/* Remote Partner Stream View Block */}
        <div className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden border border-gray-700 shadow-md flex items-center justify-center">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 text-sm text-gray-400 font-medium">
              Awaiting inbound remote participant connection...
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/60 px-2.5 py-1 rounded text-xs font-medium backdrop-blur-sm">
            Remote Peer Stream
          </div>
        </div>
      </div>

      {/* Interface Control Panel Layer */}
      <div className="flex items-center gap-5 mt-6 z-10">
      <Button
  className={`rounded-full p-4 h-auto shadow-lg transition-transform hover:scale-105 ${
    isVideoOff ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-700 text-white hover:bg-gray-600"
  }`}
  onClick={toggleVideo}
>
  {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
</Button>

<Button
  className="rounded-full px-6 py-4 h-auto shadow-lg font-semibold flex items-center gap-2 transition-transform hover:scale-105 bg-red-600 text-white hover:bg-red-700"
  onClick={endCall}
>
  <PhoneOff size={20} />
  <span>Disconnect</span>
</Button>
      </div>
    </div>
  );
};