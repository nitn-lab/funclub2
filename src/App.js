import React, { useEffect, useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/SignUp";
import NotFound from "./screens/Error/NotFound";
import Dashboard from "./screens/DashBooard/Dashboard";
import Chats from "./screens/SidebarComponents/chatScreen/Chats";
import ChatScreen from "./screens/SidebarComponents/chatScreen/ChatScreen";
import Nearby from "./screens/SidebarComponents/NearbyComponent/Nearby";
import Feeds from "./screens/SidebarComponents/Feeds";
import Live from "./screens/SidebarComponents/Live";
import Suggestions from "./screens/SidebarComponents/Suggestions";
import Profile from "./screens/SidebarComponents/Profile";
import ForgetPassword from "./screens/Auth/ForgetPassword";
import MainLayout from "./screens/Auth/MainLayout";
import SubscriptionDetails from "./screens/SidebarComponents/SubscriptionDetails";
import UserProfile from "./screens/SidebarComponents/UserProfile";
import UpdateProfile from "./screens/SidebarComponents/UpdateProfile";
import PrivacyPolicy from "./screens/SidebarComponents/PrivacyPolicy";
import TermsAndConditions from "./screens/SidebarComponents/TermsConditions";
import Settings from "./screens/SidebarComponents/Settings";
import BecomeCreator from "./screens/SidebarComponents/BecomeCreator";
import { useWebSocket } from "../src/components/context/WebSocketContext";
import { useCallContext } from "../src/components/context/CallContext";
import IncomingCallModal from "../src/components/IncomingCallModal";
import {
  CreateWebSocketConnection,
  sendMessage,
} from "../src/services/websocket";
import CallingInterface from "../src/screens/SidebarComponents/chatScreen/CallingInterface";

const App = () => {
  // const navigate = useNavigate();
  const socket = useWebSocket(); // get socket from WebSocketContext
  const [passSocket, setPassSocket] = useState();
  const {
    incomingCall,
    acceptCall,
    rejectCall,
    callState,
    setIncomingCall,
    setCallState,
    showInterface,
    setShowInterface,
    setCallType
  } = useCallContext();
  useEffect(() => {
    const socket = CreateWebSocketConnection();
    setPassSocket(socket);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message fro AAApppp:", message);
      if (message.type === "incomingCall") {
        setCallType(message.callType)
        setIncomingCall(message); // Set incoming call globally
        setCallState("incoming");
        console.log("Incoming call set:", message);
      } else if (message.type === "callEnded") {
        setIncomingCall(null); // Reset state if the call ends
        setCallState(null);
        setCallType("default")
        console.log("Call ended");
      }
    };

    // return () => socket.close();
  }, [setIncomingCall]);

  const onAcceptCall = () => {
    acceptCall(); // Change global state to reflect the call has been accepted.
  };

  const onRejectCall = () => {
    // const socket = CreateWebSocketConnection();
    rejectCall(); // End the call on this user's end.
    // Optionally send a WebSocket message to inform the caller.
    const userId = localStorage.getItem("id");
    const receiver = JSON.parse(localStorage.getItem("receiver"));
    const message = {
      type: "endCall",
      from: userId,
      to: receiver._id,
    };
    console.log("APPPPP Ending call with message:", message);
    sendMessage(socket, message);
    // socket.send(
    //   JSON.stringify({
    //     type: "callEnded",
    //     recipientId: incomingCall.callerId, // Notify the caller.
    //   })
    // );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <NotFound />,
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <NotFound />,
    },
    {
      path: "/forget-password",
      element: <ForgetPassword />,
      errorElement: <NotFound />,
    },
    {
      path: "/dashboard",
      element: <MainLayout />,
      children: [
        {
          path: "/dashboard",
          element: (
            <Dashboard
              showChatScreen={true}
              shouldNavigate={false}
              socket={socket}
            />
          ),
        },
        {
          path: "chats",
          element: (
            <Chats
              showChatScreen={true}
              shouldNavigate={false}
              socket={socket}
            />
          ), // pass socket here
        },
        {
          path: "chat/:id",
          element: <ChatScreen showChatScreen={true} socket={socket} />, // pass socket here too
        },
        {
          path: "nearby",
          element: <Nearby />,
        },
        {
          path: "feeds",
          element: <Feeds socket={socket} />,
        },
        {
          path: "live",
          element: <Live />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "suggestions",
          element: <Suggestions />,
        },
        {
          path: "subscription",
          element: <SubscriptionDetails />,
        },
        {
          path: "user/:id",
          element: <UserProfile />,
          errorElement: <NotFound />,
        },
        {
          path: "update",
          element: <UpdateProfile />,
          errorElement: <NotFound />,
        },
        {
          path: "privacy-policy",
          element: <PrivacyPolicy />,
          errorElement: <NotFound />,
        },
        {
          path: "terms",
          element: <TermsAndConditions />,
          errorElement: <NotFound />,
        },
        {
          path: "settings",
          element: <Settings />,
          errorElement: <NotFound />,
        },
        {
          path: "creator",
          element: <BecomeCreator />,
          errorElement: <NotFound />,
        },
        // {
        //   path: "calling",
        //   element: <CallingInterface />,
        //   errorElement: <NotFound />,
        // },
      ],
    },
  ]);

  return (
    <>
      {/* Render the incoming call modal globally */}

      {showInterface === true
        ? (console.log("socket", passSocket),
          (
            <CallingInterface
              socket={passSocket}
              data={incomingCall}
              callerCallType={incomingCall?.callType}
              channelName="abcd"
              user="recevier"
              endVideoCall={() => setShowInterface(false)}
            />
          ))
        : callState === "incoming" &&
          incomingCall && (
            <IncomingCallModal
              callerId={incomingCall}
              onAccept={() => {
                onAcceptCall();
                // Add logic to navigate to the relevant chat/call screen
              }}
              onReject={() => onRejectCall()}
            />
          )}

      {/* Provide the router */}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
