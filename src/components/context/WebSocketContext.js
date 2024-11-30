// WebSocketContext.js
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { CreateWebSocketConnection } from '../../services/websocket';

// // Create WebSocket Context
// const WebSocketContext = createContext();

// // WebSocket Provider Component
// export const WebSocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   useEffect(() => {
//     const handleIncomingMessage = (event) => {
//       const receivedData = JSON.parse(event.data);
//       console.log("Message received:", receivedData);
//       // Handle incoming messages here
//     };

//     const ws = CreateWebSocketConnection(handleIncomingMessage);
//     setSocket(ws);

//     // Cleanup WebSocket on unmount
//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, []);

//   return (
//     <WebSocketContext.Provider value={socket}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// // Custom Hook to use WebSocket Context
// export const useWebSocket = () => {
//   return useContext(WebSocketContext);
// };


import React, { createContext, useContext, useEffect, useState } from "react";
import { CreateWebSocketConnection } from "../../services/websocket";
import { useCallContext } from "./CallContext"; // Import the CallContext

// Create WebSocket Context
const WebSocketContext = createContext();

// WebSocket Provider Component
export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { setIncomingCall, setCallState } = useCallContext(); // Use CallContext to update call states

  useEffect(() => {
    const handleIncomingMessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log("Message received:", receivedData);

      // Check for incoming call event
      if (receivedData.type === "incoming_call") {
        setIncomingCall({
          callerId: receivedData.callerId,
          channelName: receivedData.channelName,
        });
        setCallState("incoming"); // Update the call state to 'incoming'
      }

      // Handle other WebSocket messages as needed
    };

    const ws = CreateWebSocketConnection(handleIncomingMessage);
    setSocket(ws);

    // Cleanup WebSocket on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [setIncomingCall, setCallState]); // Include dependencies to prevent stale state

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom Hook to use WebSocket Context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
