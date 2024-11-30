// import React, { createContext, useState, useContext, useEffect } from "react";

// const CallContext = createContext();

// export const CallProvider = ({ socket, children }) => {
//   const [incomingCall, setIncomingCall] = useState(null);

//   useEffect(() => {
//     socket.onmessage = (event) => {
//       const message = JSON.parse(event.data);

//       if (message.type === "incomingCall" && message.from) {
//         setIncomingCall(message); // Set global incoming call
//       }
//     };

//     return () => {
//       socket.onmessage = null; // Cleanup
//     };
//   }, [socket]);

//   return (
//     <CallContext.Provider value={{ incomingCall, setIncomingCall }}>
//       {children}
//     </CallContext.Provider>
//   );
// };

// export const useCall = () => useContext(CallContext);

import React, { createContext, useContext, useState } from "react";

const CallContext = createContext({
  callState: null,
  incomingCall: null,
  setCallState: () => {},
  setIncomingCall: () => {},
  acceptCall: () => {},
  rejectCall: () => {},
});

export const useCallContext = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [callState, setCallState] = useState("idle");
  const [showInterface, setShowInterface] = useState(false);
  const [callStatus, setCallStatus] = useState(false);
  const [callType, setCallType] = useState("default");

  const acceptCall = () => {
    setCallState("active");
    setShowInterface(true);
  };

  const rejectCall = () => {
    setCallState("idle");
    // localStorage.setItem("interface", false)
    setShowInterface(false);
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        callState,
        setIncomingCall,
        setCallState,
        acceptCall,
        rejectCall,
        showInterface,
        setShowInterface, // Added showInterface and setShowInterface state hooks to manage the video call interface visibility
        setCallStatus,
        callStatus,
        callType,
        setCallType,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
