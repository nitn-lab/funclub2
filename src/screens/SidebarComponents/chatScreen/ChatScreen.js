import React, { useState, useEffect, useRef } from "react";
import InputEmoji from "react-input-emoji";
import { FaImage } from "react-icons/fa6";
import ScrollToBottom from "react-scroll-to-bottom";
import logo from "../../assets/images/FUNCLUB logo.png";
import { IoMdCall } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import CallingInterface from "./CallingInterface";
import { sendMessage } from "../../../services/websocket";
import tick from "../../Global/icons/tick.png";
import crown from "../../Global/icons/crown.png";
import { SignalCellularConnectedNoInternet1BarOutlined } from "@mui/icons-material";
import axios from "axios";
import { useCallContext } from "../../../components/context/CallContext";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ChatScreen = ({ showChatScreen, socket, location  }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [callActive, setCallActive] = useState(location?.state?.callActive || false);
  const [isTyping, setIsTyping] = useState(false); // To track typing status
  const receiver = JSON.parse(localStorage.getItem("receiver"));
  const senderId = localStorage.getItem("id");
  const token = localStorage.getItem("jwtToken");
  const [agoraToken, setAgoraToken] = useState();
  const {callType, setCallType} = useCallContext();

  const fetchChatHistory = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/chatHistory`,
        {
          token,
          userId2: receiver._id,
        },
        {
          headers: {
            Authorization: ` ${token}`,
          },
        }
      );

      if (response.data.data) {
        setChatMessages(response.data.data);
        // console.log("Chat history fetched:", response.data.data);
      } else {
        console.error("Failed to fetch chat history");
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Handle receiving messages from WebSocket
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        console.log("Received message:", newMessage);

        // check typing status
        if (newMessage.type === "typing" && newMessage.from === receiver._id) {
          setIsTyping(true);
        } else if (
          newMessage.type === "stopTyping" &&
          newMessage.from === receiver._id
        ) {
          setIsTyping(false);
        }

        // Only add messages relevant to the current conversation
        if (
          (newMessage.from === senderId && newMessage.to === receiver._id) ||
          (newMessage.from === receiver._id && newMessage.to === senderId)
        ) {
          setChatMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            console.log("Updated chatMessages:", updatedMessages);
            return updatedMessages;
          });
        }
      };
    }
    if (receiver) {
      fetchChatHistory();
    }
  }, [socket, senderId, receiver._id]);

  const handleTyping = () => {
    if (socket) {
      const typingData = {
        type: "typing",
        from: senderId,
        to: receiver._id,
      };
      sendMessage(socket, typingData);
    }
  };

  const handleStopTyping = () => {
    if (socket) {
      const stopTypingData = {
        type: "stopTyping",
        from: senderId,
        to: receiver._id,
      };
      sendMessage(socket, stopTypingData);
    }
  };

  const handleSend = () => {
    if (message && socket) {
      const messageData = {
        type: "chatMessage",
        from: senderId,
        to: receiver._id,
        chatMessage: message,
      };
      // Send message using the WebSocket connection
      sendMessage(socket, messageData);
      console.log("sending message:", messageData);
      setChatMessages((prevMessages) => [...prevMessages, messageData]); // Add sent message locally
      setMessage(""); // Clear the input after sending
    }
  };

  return (
    <div
      className={`flip-container relative w-full h-full font-gotham font-light `}
    >
      <div
        className={`flip-card  w-full h-full transition-transform duration-500 ${
          callActive ? "flip" : ""
        }`}
      >
        <div className="front absolute top-0 left-0 w-full h-full text-white">
          {receiver ? (
            <div className="chat-screen w-full bg-fuchsia-400 h-[100vh]">
              <div className="header bg-black text-white  py-[9px] px-5">
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div>
                      <img
                        src={receiver.profileImage}
                        alt="user"
                        className="rounded-full h-10 w-10 xs:h-7 xs:w-7 object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-start gap-1">
                        <h3 className=" text-lg xs:text-base">
                          {receiver.username}
                        </h3>
                        {receiver.role === "creator" && (
                          <img src={tick} className="h-5" />
                        )}
                        {receiver.role === "vip creator" && (
                          <img src={crown} className="h-5" />
                        )}
                      </div>
                      {isTyping && <h4>Typing...</h4>}
                     
                
                    </div>
                  </div>
                  <div className={`flex ${
                  !showChatScreen ? "gap-3" : "gap-8 xs:gap-3"}`}>
                    <IoMdCall
                      className="text-white text-2xl hover:scale-125 transition-all cursor-pointer"
                      onClick={() => {setCallActive(true); setCallType("audio")}}
                    />
                    <button onClick={() => {setCallActive(true); setCallType("video")}}>
                      <FaVideo className="text-white text-2xl hover:scale-125 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Setting flex-direction: column-reverse ensures the bottom messages are rendered first, making it look like the chat is loading from the bottom.
Only the last N messages are shown using messages.slice(-MAX_MESSAGES).
spmething like this */}
{/* .chat-container {
  height: 400px;
  display: flex;
  flex-direction: column-reverse; 
  justify-content: flex-start;
  overflow: hidden; 
  border: 1px solid #ccc;
  padding: 10px;
} */}
              <ScrollToBottom
                ScrollToBottom={false}
                className={`chat-body px-2 ${
                  !showChatScreen ? "h-[65%]" : "h-[75%] xs:h-45%"
                } `}
              >
                {receiver.following.includes(senderId) ? (
                  <div>
                    {chatMessages.map((content, key) => {
                      if (
                        (content.to === receiver._id &&
                          content.from === senderId) ||
                        (content.from === receiver._id &&
                          content.to === senderId)
                      ) {
                        // Format the timestamp to 12-hour time
                        const messageDate = new Date(
                          content.timestamp || Date.now()
                        );
                        const hours = messageDate.getHours();
                        const minutes = messageDate.getMinutes();
                        const ampm = hours >= 12 ? "PM" : "AM";
                        const formattedTime = `${hours % 12 || 12}:${minutes
                          .toString()
                          .padStart(2, "0")} ${ampm}`;
                        const today = new Date();
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);

                        const formatDate = (date) => {
                          const day = date
                            .getDate()
                            .toString()
                            .padStart(2, "0");
                          const month = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                          const year = date.getFullYear();
                          return ` ${day}-${month}-${year}`;
                        };

                        let dateTag = "";
                        if (
                          messageDate.toDateString() ===
                          yesterday.toDateString()
                        ) {
                          dateTag = "Yesterday";
                        } else {
                          dateTag = formatDate(messageDate);
                        }

                        return (
                          <div key={key}>
                            {/* Display date tags when a new day starts */}
                            {/* {key === 0 || (key > 0 && messageDate.toDateString() !== new Date(chatMessages[key - 1].timestamp).toDateString()) && (
                            <div className="date-tag text-center text-white my-2">
                              {dateTag}
                            </div>
                          )} */}

                            {/* Message bubble */}
                            <div
                              className={`chat ${
                                content.from === senderId
                                  ? "chat-end"
                                  : "chat-start"
                              }`}
                            >
                              <div
                                className={`chat-bubble text-white  ${
                                  content.from === senderId
                                    ? "bg-fuchsia-900"
                                    : "bg-fuchsia-800"
                                } break-words max-w-[70%]`}
                              >
                                <p className="text-base text-left">
                                  {" "}
                                  {content.message || content.chatMessage}
                                </p>
                                <span className="timestamp text-xs block mt-1 text-right text-gray-300">
                                  {formattedTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>
                ) : (
                  <div className="justify-center text-black text-xl h-full flex items-center">
                    You can't send messages as {receiver.username} doesn't
                    follow you
                  </div>
                )}
              </ScrollToBottom>
              {receiver.following.includes(senderId) ? (
                <div className={`h-auto`}>
                  <div className="flex mx-auto items-center justify-center">
                    <div className="bg-fuchsia-800 text-white p-2 rounded-full cursor-pointer">
                      <FaImage />
                    </div>
                    <div className="w-[80%]">
                      <InputEmoji
                        background="#edecfb"
                        value={message}
                        onChange={setMessage}
                        onEnter={handleSend}
                        onKeyDown={handleTyping} // Detect typing
                        onKeyUp={handleStopTyping}
                      />
                    </div>
                    <button
                      className="py-1 px-1.5 rounded-lg bg-fuchsia-800 text-white text-bsse  hover:border-2 hover:border-fuchsia-800 hover:bg-white hover:text-fuchsia-800"
                      onClick={handleSend}
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div className="p-6 sm:hidden">
              <img src={logo} width={300} className="m-auto" alt="logo" />
              <h1 className="font-bold text-3xl text-white text-center">
                Tap to start conversation!!
              </h1>
            </div>
          )}
        </div>

        <div
          className={`back transition-transform duration-500 ${
            callActive ? "transform rotate-y-180" : ""
          }`}
        >
          {callActive && (
            <CallingInterface
              channelName="abcd"
              token="asdfghj"
              endVideoCall={() => setCallActive(false)}
              socket={socket}
              callerCallType={callType}
              user="caller"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
