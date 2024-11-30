import React, { useEffect, useState } from "react";
import logo from "../../assets/images/FUNCLUB logo.png";
import ChatScreen from "./ChatScreen";
import "react-responsive-modal/styles.css";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "./Popup";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { sendMessage } from "../../../services/websocket";
import tick from '../../Global/icons/tick.png';
import crown from '../../Global/icons/crown.png';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Chats = ({ showChatScreen, socket }) => {
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [chatScreen, setChatScreen] = useState(false);
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("jwtToken");
  const [following, setFollowing] = useState([]);
  // console.log("Chats", socket);

  const handlePopup = () => {
    setOpen(!open);
  };

  const handleWindow = (user) => {
    // console.log("recccc", user);
    localStorage.setItem("receiver", JSON.stringify(user));
    setChatScreen(true);
    if (window.innerWidth < 768) {
      navigate(`/dashboard/chat/${user._id}`);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/userById/${id}`, {
        headers: { authorization: `${token}` },
      });
      setFollowing(res.data.data.following);
    } catch (err) {
      console.log("Error fetching user data", err);
    }
  };

  const fetchFollowingUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/users`, {
        headers: { authorization: `${token}` },
      });
      const data = res.data.data.filter((user) => following.includes(user._id));
      setUsers(data);
    } catch (err) {
      console.log("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id, token]);

  useEffect(() => {
    if (following.length > 0) {
      fetchFollowingUsers();
    }
  }, [following, token]);

  return (
    <>
      <div className="flex items-start rounded-md">
        {/* {!showChatScreen && chatScreen && (
          <button
            className="text-white bg-main-gradient text-sm rounded-full p-1"
            onClick={() => setChatScreen(false)}
          >
            <CloseIcon />
          </button>
        )} */}

        <div className={`${chatScreen || showChatScreen ? "sm:hidden w-full z-50" : ""}`}>
          {showChatScreen && <div className="bg-black py-4 font-gotham font-light flex justify-around items-center text-white border-b-2 border-gray-800">
            <p>Groups</p>
            <p>Message Requests</p>
          </div>} 
          {chatScreen ? (
            <div class>
              <ChatScreen
                showChatScreen={showChatScreen}
                socket={socket} // Passing the WebSocket instance
                sendMessage={sendMessage} // Passing the sendMessage function
              />
            </div>
          ) : (
            showChatScreen && (<div className="sm:hidden w-full text-black h-[95vh] text-3xl font-gotham font-medium flex justify-center items-center">Tap to start conversation!!</div>)
          )}
        </div>
        <div
          className={`chats flex-grow font-gotham font-light scrollable-div w-[400px] ${!showChatScreen && chatScreen ? "hidden" : ""}  bg-black h-[100vh] text-white sm:w-full pb-2 overflow-y-auto shadow-lg`}
          id="user-list"
        >
          <div className="flex gap-2 items-center px-4 py-2 bg-fuchsia-800 sm:hidden">
            <img src={logo} alt="FunClub" className="w-10 h-10" />
            <h2 className="text-xl font-medium italic">CHATS</h2>
          </div>

          {users.length > 0 &&
            users.map((user) => (
              <div
                className="flex gap-4 xs:gap-3 items-center pb-3 hover:bg-fuchsia-800 hover:scale-105 transition-all py-3 px-6 cursor-pointer"
                onClick={() => {
                  setReceiver(user);
                  handleWindow(user);
                  setOpen(true);
                }}
                key={user._id}
              >
                <div className="relative">
                  <img
                    src={
                      user.profileImage ||
                      `https://avatar.iran.liara.run/username?username=${user.firstname}+${user.lastname}`
                    }
                    alt="user"
                    className="rounded-full h-12 w-12 object-cover"
                  />
                  <div className="online-status h-3 w-3 bg-[#05fc4f] rounded-full absolute top-1"></div>
                </div>
                <div>
                  <div className="flex items-start gap-1">
                    <h3 className="text-base truncate">
                      {user.username}
                    </h3>
                    {user.role === 'creator' && <img src={tick} className="h-5" />}
                    {user.role === 'vip creator' && <img src={crown} className="h-5" />}
                  </div>
                  <p className="text-gray-200 text-sm font-light">Last seen</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      {/* <Popup open={open} handlePopup={handlePopup} logo={logo} /> */}
    </>
  );
};

export default Chats;
