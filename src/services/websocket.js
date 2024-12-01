// services/websocket.js

const WEBSOCKET_URL = "wss://backendapifunclub.yourwebstore.org.in/ws/";
let pingInterval;

export const CreateWebSocketConnection = (onMessage) => {
  const ws = new WebSocket(WEBSOCKET_URL);
  const userId = localStorage.getItem("id");
  console.log("USERID", userId, onMessage);

  ws.onopen = () => {
    console.log("WebSocket connection opened");
    if (userId) {
      ws.send(
        JSON.stringify({ type: "register", from: localStorage.getItem("id") })
      );
    }

    // Start sending pings every 30 seconds
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  };

  ws.onclose = (event) => {
    console.log("WebSocket connection closed", event);
    clearInterval(pingInterval); // Clear ping interval on close
    reconnect(ws, onMessage); // Reconnect logic
  };

  ws.onerror = (error) => {
    console.error("WebSocket error", error);
    clearInterval(pingInterval); // Clear ping interval on error
    ws.close(); // Close connection to trigger reconnection
  };

  ws.onmessage = (event) => {
    try {
      // console.log("Raw message received:", event.data);
  
      // Attempt to parse JSON
      const messageData = JSON.parse(event.data);
      // console.log("Parsed message:", messageData);
  
      if (onMessage) {
        onMessage(messageData);
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message as JSON:", error);
      console.error("Received data:", event.data);
    }
  };

  return ws;
};

const reconnect = (ws, onMessage) => {
  console.log("Attempting to reconnect...");
  setTimeout(() => {
    CreateWebSocketConnection(onMessage);
  }, 5000); // Retry connection after 5 seconds
};

export const sendMessage = (ws, message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open. Message not sent:", message);
  }
};




// services/websocket.js

// 43.204.147.20    (28 nov)
// const WEBSOCKET_URL = " wss://backendapifunclub.yourwebstore.org.in/ws/";   
// const WEBSOCKET_URL = "ws://localhost:4000";


// export const CreateWebSocketConnection = (onMessage) => {
//   const ws = new WebSocket(WEBSOCKET_URL);
//   const userId = localStorage.getItem("id");
//   console.log("USERID", userId, onMessage);
//   ws.onopen = () => {
//     console.log("WebSocket connection opened");
//     if (userId) {
//       ws.send(
//         JSON.stringify({ type: "register", from: localStorage.getItem("id") })
//       );
//     }
//   };

//   ws.onclose = (event) => {
//     console.log("WebSocket connection closed", event);
//     // Optionally implement reconnection logic here
//     // setTimeout(connectWebSocket, 3000);
//   };

//   ws.onerror = (error) => {
//     console.error("WebSocket error", error);
//   };

//   // ws.onmessage = onMessage; // Pass message handler

//   ws.onmessage = (event) => {
//     const messageData = JSON.parse(event.data);
//     console.log("Received message:", messageData);

//     // Update messages state with the incoming message
//     // setMessages(prevMessages => [...prevMessages, messageData]);
//   };

//   return ws;
// };

// export const sendMessage = (ws, message) => {
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(JSON.stringify(message));
//   } else {
//     console.error("WebSocket is not open");
//   }
// };
