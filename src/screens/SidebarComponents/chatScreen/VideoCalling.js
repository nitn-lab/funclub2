import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-react";

const VideoCalling = ({ receiver, handleCallEnd }) => {
  const [joined, setJoined] = useState(false);
  const [callActive, setCallActive] = useState(true);
  const rtc = useRef({
    client: AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    localAudioTrack: null,
    localVideoTrack: null,
  }).current;
  const localContainer = useRef(null);

  useEffect(() => {
    const startCall = async () => {
      rtc.client.on("user-published", async (user, mediaType) => {
        await rtc.client.subscribe(user, mediaType);
        if (mediaType === "video") {
          const remoteContainer = document.createElement("div");
          remoteContainer.id = user.uid.toString();
          remoteContainer.style.width = "200px";
          remoteContainer.style.height = "200px";
          document.body.append(remoteContainer);
          user.videoTrack.play(remoteContainer);
        }
      });

      await rtc.client.join("9e2fe1379c2d4477aa2c02aaa03050bc", receiver._id, null, null);

      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      rtc.localVideoTrack.play(localContainer.current);
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      setJoined(true);

     
      setTimeout(() => {
        if (callActive) {
          handleEndCall();
        }
      }, 60000);  
    };

    startCall();

    return () => {
      rtc.localAudioTrack && rtc.localAudioTrack.close();
      rtc.localVideoTrack && rtc.localVideoTrack.close();
      rtc.client.leave();
    };
  }, []);

  const handleEndCall = async () => {
    await rtc.client.leave();
    rtc.localAudioTrack && rtc.localAudioTrack.close();
    rtc.localVideoTrack && rtc.localVideoTrack.close();
    setCallActive(false);
    handleCallEnd(); 
  };

  return (
    <div>
      <div ref={localContainer} style={{ width: "100%", height: "100%" }} />
      {joined ? (
        <button onClick={handleEndCall}>End Call</button>
      ) : (
        <p>Calling...</p>
      )}
    </div>
  );
};

export default VideoCalling;