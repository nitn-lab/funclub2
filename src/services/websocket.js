// services/websocket.js

// 43.204.147.20    (28 nov)
const WEBSOCKET_URL = " wss://backendapifunclub.yourwebstore.org.in/ws/";   
// const WEBSOCKET_URL = "ws://localhost:4000";


export const CreateWebSocketConnection = (onMessage) => {
  const ws = new WebSocket(WEBSOCKET_URL);
  const userId = localStorage.getItem("id");
  console.log("uerid", userId);
  ws.onopen = () => {
    console.log("WebSocket connection opened");
    if (userId) {
      ws.send(
        JSON.stringify({ type: "register", from: localStorage.getItem("id") })
      );
    }
  };

  ws.onclose = (event) => {
    console.log("WebSocket connection closed", event);
    // Optionally implement reconnection logic here
    // setTimeout(connectWebSocket, 3000);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error", error);
  };

  // ws.onmessage = onMessage; // Pass message handler

  ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    console.log("Received message:", messageData);

    // Update messages state with the incoming message
    // setMessages(prevMessages => [...prevMessages, messageData]);
  };

  return ws;
};

export const sendMessage = (ws, message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open");
  }
};
