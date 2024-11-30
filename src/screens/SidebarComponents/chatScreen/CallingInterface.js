import React, { useState, useRef, useEffect } from "react";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import {
  CreateWebSocketConnection,
  sendMessage,
} from "../../../services/websocket";
import { useCallContext } from "../../../components/context/CallContext";

const CallingInterface = ({
  appId,
  channelName,
  endVideoCall,
  socket,
  data,
  callerCallType,
  user,
}) => {
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [localTracks, setLocalTracks] = useState({ audio: null, video: null });
  const localContainer = useRef(null);
  const client = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  ).current;
  const receiver = JSON.parse(localStorage.getItem("receiver"));
  const senderId = localStorage.getItem("id");
  const [isCalling, setIsCalling] = useState(false); // Track if currently in a call
  const [incomingCall, setIncomingCall] = useState(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [initiatedEndCall, setInitiatedEndCall] = useState(false);
  const [callingSound, setCallingSound] = useState(null);
  const [ringtone, setRingtone] = useState(false);
  const { callStatus, setCallStatus, callType, setCallType } = useCallContext();
  let ringtoneRef = useRef(null);

  useEffect(() => {
    return () => {
      // stopRingtone();
      if (localTracks.audio) localTracks.audio.close();
      if (localTracks.video) localTracks.video.close();
      client
        .leave()
        .then(() => console.log("Cleanup: Left the Agora channel"))
        .catch((error) =>
          console.error("Cleanup: Error leaving the channel", error)
        );
    };
  }, []);

  // Function to fetch Agora token
  const generateAgoraToken = async () => {
    try {
      const response = await axios.get(
        `https://backendapifunclub.yourwebstore.org.in/api/v1/generate-token?channelName=${channelName}`
      );
      return response.data.token;
    } catch (error) {
      console.error("Error generating token:", error);
      return null;
    }
  };

  // Function to set up audio and video tracks
  const setupAudioVideoTracks = async () => {
    try {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true, // Acoustic Echo Cancellation
        ANS: true, // Automatic Noise Suppression
        AGC: true, // Automatic Gain Control
      });

      // const videoTrack = await AgoraRTC.createCameraVideoTrack();

      audioTrack.setVolume(100); // Ensure audio volume is set

      // videoTrack.play(localContainer.current); // Play local video

      // setLocalTracks({ audio: audioTrack, video: videoTrack });
      // return [audioTrack, videoTrack];

      if (callType === "video") {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        videoTrack.play(localContainer.current); // Play local video
        setLocalTracks({ audio: audioTrack, video: videoTrack });
        return [audioTrack, videoTrack];
      } else {
        setLocalTracks({ audio: audioTrack, video: null });
        return [audioTrack];
      }
    } catch (error) {
      console.error("Error setting up audio/video tracks:", error);
    }
  };

  useEffect(() => {
    if (user === "caller") {
      initiateCall();
    } else {
      acceptCall(socket);
    }
  }, []);

  useEffect(() => {
    // Listen for incoming call messages
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message: calinginter", message, message.type);

      if (message.type === "incomingCall" && message.from) {
        // Display incoming call UI
        setIncomingCall(message);
        // initAgora(false);
      } else if (message.type === "callEnded") {
        setCallType("default");
        setCallStatus(false);
        stopRingtone();
        endCall();
      } else if (message.type === "callAccepted") {
        setCallStatus(true);
        stopRingtone();
      }
    };

    return () => {
      if (localTracks.audio) localTracks.audio.close();
      if (localTracks.video) localTracks.video.close();
      client.leave();
    };
  }, [hasEnded]);

  const startRingtone = () => {
    if (!ringtoneRef.current) {
      ringtoneRef.current = new Audio("/ring-tone-68676.mp3");
      ringtoneRef.current.loop = true;
    }
    ringtoneRef.current.play();
  };

  const stopRingtone = () => {
    console.log("ringtoneRef.current", ringtoneRef.current);
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0; // Reset audio playback to the start
      ringtoneRef.current = null;
    }
    console.log("Ringtone stopped.");
  };

  const initiateCall = () => {
    if (isCalling) {
      console.log(
        "Call is already initiated. Ignoring duplicate call request."
      );
      return; // Prevent multiple calls
    }

    startRingtone();
    setIsCalling(true); // Mark as calling
    const userId = localStorage.getItem("id");
    const message = {
      type: "call",
      from: userId,
      to: receiver._id,
      callType: callerCallType,
    };
    console.log("Initiating call with message:", message);
    sendMessage(socket, message); // Send call initiation message
    // stopRingtone()
    initAgora(true);
  };

  // Initialize Agora
  const initAgora = async (isInitiator) => {
    const appId = "d284507a049d47c39044f072f77f8d5b";
    const channelName = "abcd";
    const token = await generateAgoraToken();
    if (!token) {
      console.error("Token is not available.");
      return;
    }

    try {
      // Step 1: Join the channel
      await client.join(appId, channelName, token);

      // Step 2: Create local audio and video tracks
      const [audioTrack, videoTrack] = await setupAudioVideoTracks();

      // Step 3: Display local video in bottom-right corner
      if (videoTrack) {
        const localVideoContainer = document.getElementById("local-video");
        if (!localVideoContainer) {
          const newLocalVideoContainer = document.createElement("div");
          newLocalVideoContainer.id = "local-video";
          newLocalVideoContainer.style.width = "25%";
          newLocalVideoContainer.style.height = "25%";
          newLocalVideoContainer.style.position = "absolute";
          newLocalVideoContainer.style.bottom = "10px";
          newLocalVideoContainer.style.right = "10px";
          newLocalVideoContainer.style.zIndex = "10";
          localContainer.current.appendChild(newLocalVideoContainer);
          videoTrack.play(newLocalVideoContainer); // Play local video
        } else {
          videoTrack.play(localVideoContainer);
        }
      }

      // Step 4: Publish local tracks
      if (audioTrack && videoTrack) {
        await client.publish([audioTrack, videoTrack]);
        console.log(
          `${isInitiator ? "Initiator" : "Receiver"} published local tracks.`
        );
      }

      // Step 5: Handle remote user tracks
      client.on("user-published", async (user, mediaType) => {
        console.log(`User ${user.uid} published ${mediaType} track.`);
        await client.subscribe(user, mediaType); // Subscribe to the remote user
        console.log(`Subscribed to user ${user.uid}'s ${mediaType} track.`);

        if (mediaType === "video") {
          const remoteVideoContainer = document.getElementById("remote-video");
          if (!remoteVideoContainer) {
            const newRemoteVideoContainer = document.createElement("div");
            newRemoteVideoContainer.id = "remote-video";
            newRemoteVideoContainer.style.width = "100%";
            newRemoteVideoContainer.style.height = "100%";
            localContainer.current.appendChild(newRemoteVideoContainer);
            user.videoTrack.play(newRemoteVideoContainer); // Play remote video
          } else {
            user.videoTrack.play(remoteVideoContainer);
          }
        }

        if (mediaType === "audio") {
          user.audioTrack.play(); // Play remote audio
        }
      });

      // Step 6: Handle remote user leaving
      client.on("user-unpublished", (user) => {
        console.log(`User ${user.uid} unpublished their track.`);
        const remoteVideoContainer = document.getElementById("remote-video");
        if (remoteVideoContainer) {
          remoteVideoContainer.innerHTML = ""; // Clear remote video
        }
      });

      client.on("user-left", (user) => {
        console.log(`User ${user.uid} left the channel.`);
        const remoteVideoContainer = document.getElementById("remote-video");
        if (remoteVideoContainer) {
          remoteVideoContainer.innerHTML = ""; // Clear remote video
        }
      });
    } catch (error) {
      console.error("Error in Agora setup:", error);
    }
  };

  const endCall = async () => {
    if (hasEnded) return; // Prevent duplicate end calls

    setHasEnded(true);
    stopRingtone();
    if (!initiatedEndCall) {
      const message = {
        type: "endCall",
        from: senderId,
        to: receiver._id,
      };
      sendMessage(socket, message);
      setInitiatedEndCall(true);
    }

    // Stop and close tracks
    if (localTracks.audio) {
      localTracks.audio.stop();
      localTracks.audio.close();
      setLocalTracks((prev) => ({ ...prev, audio: null }));
    }
    if (localTracks.video) {
      localTracks.video.stop();
      localTracks.video.close();
      setLocalTracks((prev) => ({ ...prev, video: null }));
    }

    // Leave the Agora channel
    try {
      await client.leave();
      console.log("Successfully left the Agora channel.");
    } catch (error) {
      console.error("Error leaving the Agora channel:", error);
    }

    setIsCalling(false);
    endVideoCall();
  };

  const acceptCall = (socket) => {
    if (data) {
      sendMessage(socket, {
        type: "acceptCall",
        from: senderId,
        to: data?.from,
        channelName: data?.channelName,
      });
      stopRingtone();
      // console.log("calllllllllllllinnnnnnng acceptCall", data, socket);

      initAgora(false);

      setIncomingCall(null); // Reset incoming call state
    }
  };

  const toggleMuteAudio = () => {
    if (localTracks.audio) {
      const newMuteState = !audioMuted;
      localTracks.audio.setMuted(newMuteState); // Mute or unmute only the local user's audio
      setAudioMuted(newMuteState); // Update the local mute state in UI
      console.log(`Audio muted: ${newMuteState}`);
    } else {
      console.error("No local audio track available to mute/unmute.");
    }
    // if (localTracks.audio) {
    //   const newMuteState = !audioMuted;
    //   localTracks.audio.setMuted(newMuteState);
    //   setAudioMuted(newMuteState);
    // }
  };

  const toggleMuteVideo = async () => {
    if (localTracks.video) {
      const newMuteState = !videoMuted;
      localTracks.video.setEnabled(newMuteState); // Enable or disable local user's video
      setVideoMuted(newMuteState);
      console.log(`Video muted: ${newMuteState}`);
    }
    // if (localTracks.video) {
    //   const newMuteState = !videoMuted;
    //   localTracks.video.setMuted(newMuteState);
    //   setVideoMuted(!videoMuted);
    // }
  };

  return (
    <div className="relative w-full h-[100vh] bg-black text-white mx-auto bg-opacity-75 z-20">
      <span className="text-lg text-center z-20 w-full pt-5 absolute">
        {callStatus ? "Connected" : "Ringing...."}
      </span>
      {/* Display Local Video */}

      <div className="flex justify-center relative w-full h-[100vh]">
        {callType === "video" ? (
          <div
            className="flex justify-center absolute items-center w-full h-[100vh]"
            ref={localContainer}
          >
            {!localTracks.video && (
              <p className="loading loading-spinner loading-md mx-auto"></p>
            )}
          </div>
        ) : (
          <p className="text-white text-center">Audio Call in Progress</p>
        )}
      </div>

      <div className="flex justify-center">
        <div className="flex gap-10 justify-between absolute bottom-28">
          <button
            onClick={toggleMuteAudio}
            className="bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200"
          >
            {audioMuted ? <MicOffIcon /> : <MicIcon />}
          </button>

          <button
            onClick={endCall}
            className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-500"
          >
            End Call
          </button>
         
          {callType === "video" ? (
            <button
              onClick={toggleMuteVideo}
              className="bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200"
            >
              {videoMuted ? <VideocamOffIcon /> : <VideocamIcon />}
            </button>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallingInterface;

// const initAgora = async (isInitiator) => {
//   const appId = "d284507a049d47c39044f072f77f8d5b";
//   const channelName = "abcd";
//   const token = await generateAgoraToken();
//   if (!token) {
//     console.error("Token is not available.");
//     return;
//   }

//   try {
//     await client.join(appId, channelName, token);

//     if (isInitiator) {
//       // Step 2: If the user is the caller, publish their tracks
//       const [audioTrack, videoTrack] = await setupAudioVideoTracks();
//       if (audioTrack && videoTrack) {
//         await client.publish([audioTrack, videoTrack]);
//         console.log("Published local tracks as initiator.");
//         setCallingSound(false);
//       }
//     } else {
//       // Publish the receiver's local tracks
//       const [audioTrack, videoTrack] = await setupAudioVideoTracks();
//       await client.publish([audioTrack, videoTrack]);

//       // Step 2: If the user is the receiver, subscribe to the caller's tracks
//       client.on("user-published", async (user, mediaType) => {
//         await client.subscribe(user, mediaType); // Subscribe to the caller's tracks
//         console.log(`Subscribed to user ${user.uid}'s ${mediaType} track`);

//         if (mediaType === "video") {
//           const remoteContainer = document.createElement("div");
//           remoteContainer.id = user.uid.toString();
//           remoteContainer.style.width = "100%";
//           remoteContainer.style.height = "100%";
//           localContainer.current.appendChild(remoteContainer);
//           user.videoTrack.play(remoteContainer); // Play remote video
//         }
//         setCallingSound(false);
//         // stopRingtone();

//         if (mediaType === "audio") {
//           user.audioTrack.play(); // Play remote audio
//         }
//       });
//       // stopRingtone();
//       console.log("Receiver is ready to subscribe to tracks.");
//     }
//   } catch (error) {
//     console.error("Failed to join channel or create tracks:", error);
//   }
// };

// const initAgora = async (isInitiator) => {
//   const appId = "d284507a049d47c39044f072f77f8d5b";
//   const channelName = "abcd";
//   const token = await generateAgoraToken();
//   if (!token) {
//     console.error("Token is not available.");
//     return;
//   }

//   try {
//     await client.join(appId, channelName, token);

//     // Step 1: Create and play local video/audio tracks
//     const [audioTrack, videoTrack] = await setupAudioVideoTracks();
//     if (videoTrack) {
//       const localVideoContainer = document.createElement("div");
//       localVideoContainer.id = "local-video";
//       localVideoContainer.style.width = "25%";
//       localVideoContainer.style.height = "25%";
//       localVideoContainer.style.position = "absolute";
//       localVideoContainer.style.bottom = "10px";
//       localVideoContainer.style.right = "10px";
//       localContainer.current.appendChild(localVideoContainer);
//       videoTrack.play(localVideoContainer); // Play local video
//     }

//     if (isInitiator) {
//       // Step 2: Publish caller's tracks
//       if (audioTrack && videoTrack) {
//         await client.publish([audioTrack, videoTrack]);
//         console.log("Published local tracks as initiator.");
//         setCallingSound(false);
//       }
//     } else {
//       // Step 2: Publish receiver's tracks and subscribe to remote tracks
//       if (audioTrack && videoTrack) {
//         await client.publish([audioTrack, videoTrack]);
//         console.log("Published local tracks as receiver.");
//       }

//       client.on("user-published", async (user, mediaType) => {
//         await client.subscribe(user, mediaType); // Subscribe to remote tracks
//         console.log(`Subscribed to user ${user.uid}'s ${mediaType} track`);

//         if (mediaType === "video") {
//           const remoteContainer = document.createElement("div");
//           remoteContainer.id = user.uid.toString();
//           remoteContainer.style.width = "100%";
//           remoteContainer.style.height = "100%";
//           localContainer.current.appendChild(remoteContainer);

//           user.videoTrack.play(remoteContainer); // Play remote video
//         }

//         if (mediaType === "audio") {
//           user.audioTrack.play(); // Play remote audio
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Failed to join channel or create tracks:", error);
//   }
// };

// const rejectCall = () => {
//   if (incomingCall) {
//     sendMessage(socket, {
//       type: "callRejected",
//       from: senderId,
//       to: incomingCall.from,
//     });
//     setIncomingCall(null); // Reset incoming call state
//     stopRingtone();
//     if (callingSound) {
//       callingSound.stop();
//     }
//     // Close tracks and leave channel
//     if (localTracks.audio) {
//       localTracks.audio.stop();
//       localTracks.audio.close();
//       setLocalTracks((prev) => ({ ...prev, audio: null }));
//     }
//     if (localTracks.video) {
//       localTracks.video.stop();
//       localTracks.video.close();
//       setLocalTracks((prev) => ({ ...prev, video: null }));
//     }

//     client
//       .leave()
//       .then(() => console.log("Left the Agora channel successfully"))
//       .catch((error) => console.error("Failed to leave the channel:", error));
//   }
// };
