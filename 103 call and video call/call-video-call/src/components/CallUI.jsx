// src/components/CallUI.jsx
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { ref, set, onValue, push, remove, update } from "firebase/database";

const servers = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
};

const CALL_TIMEOUT = 30000; // 30 seconds
const ICE_TIMEOUT = 5000; // 5 seconds to wait for ICE candidates

export default function CallUI({
  callId,
  username,
  remoteUser,
  isCaller,
  onCallEnd,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const unsubscribersRef = useRef([]);
  const pendingCandidatesRef = useRef([]);
  const callTimeoutRef = useRef(null);

  const [callStatus, setCallStatus] = useState(
    isCaller ? "calling" : "incoming"
  );
  const [error, setError] = useState(null);
  // callStatus: "incoming", "calling", "connecting", "connected", "ended", "error"

  /** Register a listener and track unsubscriber */
  const registerListener = (listener) => {
    try {
      const unsub = listener();
      if (unsub && typeof unsub === "function") {
        unsubscribersRef.current.push(unsub);
      }
      return unsub;
    } catch (err) {
      console.error("Error registering listener:", err);
      return null;
    }
  };

  /** Setup local media */
  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 480 } },
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      console.error("Media access error:", err);
      setError(
        "Could not access camera/microphone. Check browser permissions."
      );
      endCall();
      return null;
    }
  };

  /** Setup peer connection with proper event handlers */
  const setupPeerConnection = (stream) => {
    try {
      const peer = new RTCPeerConnection(servers);
      pcRef.current = peer;

      // Add local tracks
      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      // Handle remote stream
      peer.ontrack = (event) => {
        console.log("📡 Remote stream received");
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE connection state changes
      peer.oniceconnectionstatechange = () => {
        console.log("🔌 ICE State:", peer.iceConnectionState);
        switch (peer.iceConnectionState) {
          case "connected":
          case "completed":
            setCallStatus("connected");
            clearTimeout(callTimeoutRef.current);
            break;
          case "disconnected":
          case "failed":
          case "closed":
            console.log("Connection lost");
            endCall();
            break;
          default:
            break;
        }
      };

      // Handle connection state changes
      peer.onconnectionstatechange = () => {
        console.log("📊 Connection State:", peer.connectionState);
        if (
          peer.connectionState === "failed" ||
          peer.connectionState === "disconnected" ||
          peer.connectionState === "closed"
        ) {
          endCall();
        }
      };

      // Handle signaling state for debugging
      peer.onsignalingstatechange = () => {
        console.log("🔗 Signaling State:", peer.signalingState);
      };

      return peer;
    } catch (err) {
      console.error("Error setting up peer connection:", err);
      setError("Failed to setup connection");
      return null;
    }
  };

  /** Add ICE candidate, handling cases where remote description isn't ready */
  const addIceCandidate = async (candidate) => {
    if (!pcRef.current) return;

    try {
      if (!pcRef.current.remoteDescription) {
        // Queue for later
        pendingCandidatesRef.current.push(candidate);
        console.log("📋 Queued ICE candidate (waiting for remote description)");
        return;
      }

      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("✅ Added ICE candidate");
    } catch (err) {
      console.error("Error adding ICE candidate:", err);
    }
  };

  /** Process queued ICE candidates after remote description is set */
  const processQueuedCandidates = async () => {
    if (!pcRef.current || !pcRef.current.remoteDescription) return;

    console.log(
      `🔄 Processing ${pendingCandidatesRef.current.length} queued candidates`
    );
    const candidates = [...pendingCandidatesRef.current];
    pendingCandidatesRef.current = [];

    for (const candidate of candidates) {
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding queued candidate:", err);
      }
    }
  };

  /** CALLER — Create and send offer */
  const startCall = async () => {
    console.log("📞 Starting call as caller...");
    setCallStatus("calling");

    const stream = await setupMedia();
    if (!stream) return;

    const peer = setupPeerConnection(stream);
    if (!peer) return;

    try {
      const callRef = ref(db, `calls/${callId}`);
      const offerCandidates = ref(db, `calls/${callId}/callerCandidates`);

      // Collect ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          try {
            push(offerCandidates, event.candidate.toJSON());
          } catch (err) {
            console.error("Error sending ICE candidate:", err);
          }
        }
      };

      // Create and send offer
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      await update(callRef, { offer: offer.toJSON ? offer.toJSON() : offer });
      console.log("📤 Offer sent");

      // Set call timeout (caller waits for answer)
      callTimeoutRef.current = setTimeout(() => {
        console.log("⏱️ Call timeout - no answer received");
        endCall();
        setError("Call timeout - recipient did not answer");
      }, CALL_TIMEOUT);

      // Listen for answer
      const answerRef = ref(db, `calls/${callId}/answer`);
      registerListener(() =>
        onValue(answerRef, async (snap) => {
          const data = snap.val();
          if (
            data &&
            data.type &&
            pcRef.current &&
            pcRef.current.signalingState !== "stable"
          ) {
            try {
              console.log("📥 Got answer");
              clearTimeout(callTimeoutRef.current);
              await pcRef.current.setRemoteDescription(
                new RTCSessionDescription(data)
              );
              await processQueuedCandidates();
              setCallStatus("connecting");
            } catch (err) {
              console.error("Error setting remote description:", err);
              setError("Failed to process answer");
              endCall();
            }
          }
        })
      );

      // Listen for callee ICE candidates
      const calleeRef = ref(db, `calls/${callId}/calleeCandidates`);
      registerListener(() =>
        onValue(calleeRef, (snap) => {
          const list = snap.val();
          if (!list) return;
          Object.values(list).forEach((c) => {
            addIceCandidate(c);
          });
        })
      );
    } catch (err) {
      console.error("Error in startCall:", err);
      setError("Failed to start call");
      endCall();
    }
  };

  /** CALLEE — Accept call */
  const acceptCall = async () => {
    console.log("✅ Accepting call...");
    setCallStatus("connecting");

    const stream = await setupMedia();
    if (!stream) return;

    const peer = setupPeerConnection(stream);
    if (!peer) return;

    try {
      const callRef = ref(db, `calls/${callId}`);
      const answerRef = ref(db, `calls/${callId}/answer`);
      const calleeCandidates = ref(db, `calls/${callId}/calleeCandidates`);

      // Collect ICE candidates
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          try {
            push(calleeCandidates, event.candidate.toJSON());
          } catch (err) {
            console.error("Error sending ICE candidate:", err);
          }
        }
      };

      // Update status to accepted
      await update(callRef, { status: "accepted" });

      // Get offer and create answer
      const offerRef = ref(db, `calls/${callId}/offer`);
      registerListener(() =>
        onValue(offerRef, async (snap) => {
          const data = snap.val();
          if (
            data &&
            data.type &&
            pcRef.current &&
            !pcRef.current.remoteDescription
          ) {
            try {
              console.log("📥 Offer received, creating answer...");
              await pcRef.current.setRemoteDescription(
                new RTCSessionDescription(data)
              );

              // Process any queued candidates after setting remote description
              await processQueuedCandidates();

              const answer = await pcRef.current.createAnswer();
              await pcRef.current.setLocalDescription(answer);

              await set(answerRef, answer.toJSON ? answer.toJSON() : answer);
              console.log("📤 Answer sent");
            } catch (err) {
              console.error("Error processing offer:", err);
              setError("Failed to process call");
              endCall();
            }
          }
        })
      );

      // Listen for caller ICE candidates
      const candidateRef = ref(db, `calls/${callId}/callerCandidates`);
      registerListener(() =>
        onValue(candidateRef, (snap) => {
          const list = snap.val();
          if (!list) return;
          Object.values(list).forEach((c) => {
            addIceCandidate(c);
          });
        })
      );
    } catch (err) {
      console.error("Error in acceptCall:", err);
      setError("Failed to accept call");
      endCall();
    }
  };

  /** Reject call */
  const rejectCall = async () => {
    console.log("❌ Rejecting call");
    try {
      await update(ref(db, `calls/${callId}`), { status: "rejected" });
      await remove(ref(db, `calls/${callId}`));
    } catch (err) {
      console.error("Error rejecting call:", err);
    }
    cleanup();
    onCallEnd();
  };

  /** Cleanup all resources and listeners */
  const cleanup = () => {
    console.log("🧹 Cleaning up resources");

    // Unsubscribe from all Firebase listeners
    unsubscribersRef.current.forEach((unsub) => {
      try {
        unsub();
      } catch (err) {
        console.error("Error unsubscribing:", err);
      }
    });
    unsubscribersRef.current = [];

    // Stop local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (err) {
          console.error("Error stopping track:", err);
        }
      });
      localStreamRef.current = null;
    }

    // Close peer connection
    if (pcRef.current) {
      try {
        pcRef.current.close();
      } catch (err) {
        console.error("Error closing peer connection:", err);
      }
      pcRef.current = null;
    }

    // Clear pending candidates
    pendingCandidatesRef.current = [];

    // Clear timeouts
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
  };

  /** End call - closes connection for both users immediately */
  const endCall = () => {
    console.log("📴 Ending call");
    clearTimeout(callTimeoutRef.current);

    // Cleanup local resources immediately (synchronous)
    cleanup();

    // Notify parent component immediately
    onCallEnd();

    // Update Firebase asynchronously (don't wait for it)
    update(ref(db, `calls/${callId}`), { status: "ended" }).catch((err) =>
      console.error("Error updating call status:", err)
    );

    // Remove call data from Firebase asynchronously
    remove(ref(db, `calls/${callId}`)).catch((err) =>
      console.error("Error removing call:", err)
    );
  };

  /** Monitor call status changes - detect when other user ends call */
  useEffect(() => {
    const callRef = ref(db, `calls/${callId}`);
    const unsubscribe = onValue(
      callRef,
      (snap) => {
        const data = snap.val();
        if (!data || data.status === "ended" || data.status === "rejected") {
          console.log("📵 Call ended by other user");
          cleanup();
          onCallEnd();
        }
      },
      (err) => {
        console.error("Error monitoring call status:", err);
      }
    );
    return () => {
      try {
        unsubscribe();
      } catch (e) {
        console.error("Error unsubscribing from call status:", e);
      }
    };
  }, [callId, onCallEnd]);

  /** Auto-start call if caller */
  useEffect(() => {
    if (isCaller) {
      startCall();
    }
  }, [isCaller]);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.95)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* Incoming Call Modal */}
      {callStatus === "incoming" && (
        <div
          style={{
            backgroundColor: "white",
            padding: 40,
            borderRadius: 12,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            maxWidth: 400,
          }}
        >
          <h2 style={{ marginBottom: 10, marginTop: 0 }}>📞 Incoming Call</h2>
          <p style={{ fontSize: 18, marginBottom: 30, color: "#333" }}>
            <strong>{remoteUser}</strong> is calling you...
          </p>
          <div style={{ display: "flex", gap: 15, justifyContent: "center" }}>
            <button
              onClick={acceptCall}
              style={{
                padding: "12px 30px",
                fontSize: 16,
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              ✅ Accept
            </button>
            <button
              onClick={rejectCall}
              style={{
                padding: "12px 30px",
                fontSize: 16,
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
            >
              ❌ Reject
            </button>
          </div>
        </div>
      )}

      {/* Call in Progress */}
      {(callStatus === "calling" ||
        callStatus === "connecting" ||
        callStatus === "connected") && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: 20,
              backgroundColor: "#1a1a1a",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18 }}>
              Call with <strong>{remoteUser}</strong>
              {callStatus === "calling" && (
                <span
                  style={{ marginLeft: 10, fontSize: 14, color: "#ffc107" }}
                >
                  ⏳ Calling...
                </span>
              )}
              {callStatus === "connecting" && (
                <span
                  style={{ marginLeft: 10, fontSize: 14, color: "#17a2b8" }}
                >
                  🔗 Connecting...
                </span>
              )}
              {callStatus === "connected" && (
                <span
                  style={{ marginLeft: 10, fontSize: 14, color: "#28a745" }}
                >
                  ✅ Connected
                </span>
              )}
            </h2>
            <button
              onClick={endCall}
              style={{
                padding: "10px 25px",
                fontSize: 16,
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: "bold",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
            >
              ❌ End Call
            </button>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              gap: 20,
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "white", marginTop: 0 }}>You</h3>
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: 400,
                  height: 300,
                  backgroundColor: "#000",
                  borderRadius: 10,
                  border: "3px solid #444",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <h3 style={{ color: "white", marginTop: 0 }}>{remoteUser}</h3>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{
                  width: 400,
                  height: 300,
                  backgroundColor: "#000",
                  borderRadius: 10,
                  border: "3px solid #444",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: 20,
            borderRadius: 8,
            maxWidth: 500,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 10 }}>⚠️ Call Error</h3>
          <p style={{ marginBottom: 10 }}>{error}</p>
          <button
            onClick={() => {
              setError(null);
              endCall();
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#721c24",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
