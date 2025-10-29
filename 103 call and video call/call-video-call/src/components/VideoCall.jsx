import React, { useRef, useState, useEffect } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Simple P2P calling component with:
 * - Firestore single doc signaling: "call/globalCall"
 * - Incoming-call popup (Accept / Reject)
 * - Offer/Answer + ICE candidates exchange
 * - Hangup & cleanup
 *
 * IMPORTANT:
 * - Test on two different devices (or two different browsers with camera access)
 * - App must be served over HTTPS (or localhost)
 */

const servers = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302"] },
    // Example TURN (metered public). Replace with your TURN if needed for production:
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "openai",
      credential: "openai",
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function VideoCall() {
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const [incomingCall, setIncomingCall] = useState(null); // { callerId } or null
  const [isCaller, setIsCaller] = useState(false);
  const [connected, setConnected] = useState(false);
  const [callLoading, setCallLoading] = useState(false);

  const callDoc = doc(db, "call", "globalCall");
  const callerCandidatesCollection = collection(callDoc, "callerCandidates");
  const calleeCandidatesCollection = collection(callDoc, "calleeCandidates");

  // helper to stop & cleanup streams and peer
  const localCleanup = async () => {
    try {
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch (e) {}
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((t) => t.stop());
        remoteStreamRef.current = null;
      }
      const localV = document.getElementById("localVideo");
      const remoteV = document.getElementById("remoteVideo");
      if (localV) localV.srcObject = null;
      if (remoteV) remoteV.srcObject = null;
    } catch (err) {
      console.warn("cleanup error", err);
    }
  };

  // initialize media (camera + mic)
  const setupMedia = async () => {
    if (!localStreamRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      const localV = document.getElementById("localVideo");
      if (localV) localV.srcObject = stream;
    }

    if (!remoteStreamRef.current) {
      remoteStreamRef.current = new MediaStream();
      const remoteV = document.getElementById("remoteVideo");
      if (remoteV) remoteV.srcObject = remoteStreamRef.current;
    }
  };

  // create RTCPeerConnection and attach tracks
  const createPeerConnection = async () => {
    pcRef.current = new RTCPeerConnection(servers);

    // add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, localStreamRef.current);
      });
    }

    // when remote track arrives
    pcRef.current.ontrack = (event) => {
      // event.streams[0] is usually present
      const [stream] = event.streams;
      if (stream) {
        stream.getTracks().forEach((t) => {
          remoteStreamRef.current.addTrack(t);
        });
      } else {
        // fallback: add tracks from event
        event.track && remoteStreamRef.current.addTrack(event.track);
      }

      const remoteV = document.getElementById("remoteVideo");
      setTimeout(() => {
        try {
          remoteV && remoteV.play && remoteV.play().catch(() => {});
        } catch (e) {}
      }, 150);
    };

    pcRef.current.oniceconnectionstatechange = () => {
      console.log("ICE state:", pcRef.current.iceConnectionState);
      if (pcRef.current.iceConnectionState === "connected") {
        setConnected(true);
      }
      if (
        pcRef.current.iceConnectionState === "disconnected" ||
        pcRef.current.iceConnectionState === "failed" ||
        pcRef.current.iceConnectionState === "closed"
      ) {
        setConnected(false);
      }
    };
  };

  // Start a call (caller)
  const startCall = async () => {
    setCallLoading(true);
    setIsCaller(true);

    // remove previous call doc (simple cleanup) - ignore errors
    await deleteDoc(callDoc).catch(() => {});

    await setupMedia();
    await createPeerConnection();

    // candidates from this client => callerCandidates collection
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(callerCandidatesCollection, event.candidate.toJSON()).catch(
          console.error
        );
      }
    };

    // create offer
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    // write offer + status + a simple callerId
    const callerId = `caller-${Date.now()}`;
    await setDoc(callDoc, { offer, status: "calling", callerId }).catch(
      console.error
    );

    // listen for answer / status changes
    const unsubCall = onSnapshot(callDoc, async (snap) => {
      const data = snap.data();
      if (!data) return;

      // when callee accepted and answered
      if (
        data.status === "connected" &&
        data.answer &&
        !pcRef.current.currentRemoteDescription
      ) {
        try {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        } catch (err) {
          console.warn("setRemoteDescription error (caller)", err);
        }
      }

      // if callee ended or rejected
      if (data.status === "ended") {
        await hangUp(false); // false -> do not try to update doc again
      }
    });

    // listen for candidate additions by callee
    const unsubCalleeCandidates = onSnapshot(
      calleeCandidatesCollection,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const cand = change.doc.data();
            pcRef.current
              .addIceCandidate(new RTCIceCandidate(cand))
              .catch((e) => console.warn("addIceCandidate(callee)->", e));
          }
        });
      }
    );

    // keep the listeners alive for the duration of the call (cleanup in hangUp)
    setCallLoading(false);
  };

  // Answer an incoming call (callee)
  const answerCall = async () => {
    setCallLoading(true);
    setIsCaller(false);

    await setupMedia();
    await createPeerConnection();

    // candidate events from this client => calleeCandidates collection
    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(calleeCandidatesCollection, event.candidate.toJSON()).catch(
          console.error
        );
      }
    };

    // read latest call doc
    const callDataSnap = await getDoc(callDoc);
    const callData = callDataSnap.exists() ? callDataSnap.data() : null;
    if (!callData || !callData.offer) {
      alert("No incoming offer found or it was cancelled.");
      setCallLoading(false);
      return;
    }

    // set remote description (offer)
    try {
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(callData.offer)
      );
    } catch (err) {
      console.warn("setRemoteDescription (callee) error", err);
    }

    // create answer and set local desc
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    // update call doc with answer and connected status
    await updateDoc(callDoc, { answer, status: "connected" });

    // start listening for caller's ICE candidates
    const unsubCallerCandidates = onSnapshot(
      callerCandidatesCollection,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const cand = change.doc.data();
            pcRef.current
              .addIceCandidate(new RTCIceCandidate(cand))
              .catch((e) => console.warn("addIceCandidate(caller)->", e));
          }
        });
      }
    );

    setIncomingCall(null);
    setCallLoading(false);
  };

  // Hang up and cleanup
  // If notifyFirestore is true we update call doc with 'ended' or delete it.
  const hangUp = async (notifyFirestore = true) => {
    try {
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch (e) {}
        pcRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      if (remoteStreamRef.current) {
        remoteStreamRef.current.getTracks().forEach((t) => t.stop());
        remoteStreamRef.current = null;
      }

      const localV = document.getElementById("localVideo");
      const remoteV = document.getElementById("remoteVideo");
      if (localV) localV.srcObject = null;
      if (remoteV) remoteV.srcObject = null;

      setConnected(false);
      setIsCaller(false);
      setIncomingCall(null);
    } catch (err) {
      console.warn("hangUp cleanup error", err);
    }

    // Try to delete call doc and candidate subcollections for clean slate
    if (notifyFirestore) {
      try {
        // delete candidate docs (Firestore doesn't allow direct subcollection delete)
        const q1 = query(collection(callDoc, "callerCandidates"));
        const callerDocs = await getDocs(q1);
        callerDocs.forEach((d) => d.ref.delete().catch(() => {}));

        const q2 = query(collection(callDoc, "calleeCandidates"));
        const calleeDocs = await getDocs(q2);
        calleeDocs.forEach((d) => d.ref.delete().catch(() => {}));

        // delete the call doc itself
        await deleteDoc(callDoc).catch(() => {});
      } catch (err) {
        console.warn("Firestore cleanup error", err);
      }
    }
  };

  // Firestore listener - listens for incoming calls (status: "calling")
  // and for status changes like "ended" (so UI can react)
  useEffect(() => {
    const unsub = onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!data) {
        // no active call
        setIncomingCall(null);
        return;
      }

      // If someone wrote status 'calling' and we are NOT the caller and we don't already have an active pc -> incoming
      if (data.status === "calling") {
        // If this client already started a call (isCaller) then ignore
        if (!isCaller && !pcRef.current && !incomingCall && !connected) {
          setIncomingCall({ callerId: data.callerId || "unknown" });
        }
      }

      // handle remote end/reject
      if (data.status === "ended") {
        // remote ended, cleanup local resources
        hangUp(false);
      }

      // If status switched to connected and we're caller, try to set remote answer if present
      if (
        isCaller &&
        data.status === "connected" &&
        data.answer &&
        pcRef.current &&
        !pcRef.current.currentRemoteDescription
      ) {
        (async () => {
          try {
            await pcRef.current.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          } catch (err) {
            console.warn("setRemoteDescription (listener) error", err);
          }
        })();
      }
    });

    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCaller, incomingCall, connected]);

  // UI handlers for incoming popup
  const onAcceptIncoming = async () => {
    setIncomingCall(null);
    await answerCall();
  };

  const onRejectIncoming = async () => {
    // mark call ended so caller knows
    await updateDoc(callDoc, { status: "ended" }).catch(() => {});
    setIncomingCall(null);
  };

  // small helper to render incoming modal
  const IncomingModal = ({ callerId, onAccept, onReject }) => (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "white",
        border: "1px solid #ddd",
        padding: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <strong>Incoming call</strong>
        <div style={{ fontSize: 12, color: "#555" }}>{callerId}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onAccept} disabled={callLoading}>
          Accept
        </button>
        <button onClick={onReject} disabled={callLoading}>
          Reject
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Simple Calling (Firestore signaling)</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div>Local</div>
          <video
            id="localVideo"
            autoPlay
            muted
            playsInline
            style={{ width: 300, height: 225, background: "#000" }}
          />
        </div>

        <div>
          <div>Remote</div>
          <video
            id="remoteVideo"
            autoPlay
            playsInline
            controls={connected}
            style={{ width: 300, height: 225, background: "#000" }}
          />
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button onClick={startCall} disabled={callLoading}>
          Call
        </button>

        <button
          onClick={() => {
            // allow quick accept if someone already called and you want to manually accept
            if (incomingCall) onAcceptIncoming();
            else alert("No incoming call to accept right now.");
          }}
        >
          Accept (if ringing)
        </button>

        <button
          onClick={() => {
            hangUp(true);
          }}
          style={{ background: "crimson", color: "white" }}
        >
          Hang Up
        </button>
      </div>

      {/* incoming UI */}
      {incomingCall && (
        <IncomingModal
          callerId={incomingCall.callerId}
          onAccept={onAcceptIncoming}
          onReject={onRejectIncoming}
        />
      )}

      <div style={{ marginTop: 12, color: "#666", fontSize: 13 }}>
        Notes:
        <ul>
          <li>Open app on two devices / browsers.</li>
          <li>
            On device A press <b>Call</b>. On device B you'll see incoming
            popup.
          </li>
          <li>Accept on device B to connect. Hang Up cleans Firestore doc.</li>
        </ul>
      </div>
    </div>
  );
}
