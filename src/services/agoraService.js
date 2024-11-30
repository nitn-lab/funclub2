// src/services/agoraService.js
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-sdk-ng";

const appId = "d284507a049d47c39044f072f77f8d5b"; // Get this from your Agora account

let agoraClient;
let localTracks = {
  videoTrack: null,
  audioTrack: null,
};

export const initializeAgora = async (channel, token, uid) => {
  agoraClient = createClient({ mode: "rtc", codec: "vp8" });

  await agoraClient.join(appId, channel, token, uid);

  const [microphoneTrack, cameraTrack] = await createMicrophoneAndCameraTracks();

  localTracks.videoTrack = cameraTrack;
  localTracks.audioTrack = microphoneTrack;

  agoraClient.publish(Object.values(localTracks));

  return { microphoneTrack, cameraTrack };
};

export const leaveAgoraChannel = async () => {
  if (localTracks.videoTrack) localTracks.videoTrack.close();
  if (localTracks.audioTrack) localTracks.audioTrack.close();

  await agoraClient.leave();
};
