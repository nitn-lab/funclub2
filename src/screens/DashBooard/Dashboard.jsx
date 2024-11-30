import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import UserInfo from "./RightSidebar/UserInfo";
import Suggestions from "./RightSidebar/Suggestions";
import CallerProfile from "./RightSidebar/CallerProfile";
import Chats from "../SidebarComponents/chatScreen/Chats";
import chat from "../Global/icons/live-chat.png";
import axios from 'axios';
import tick from '../Global/icons/tick.png';
import crown from '../Global/icons/crown.png';
import { IoMdMenu } from "react-icons/io";
import VideoData from "./Videos.json";

const VideoCarousel = React.lazy(() => import("./VideoCarousel"));
const Callers = React.lazy(() => import("./Callers"));
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Extracted reusable components
const UserProfileSection = React.memo(({ user, isSidebarExpanded }) => {
  if (!isSidebarExpanded) return null;
  
  return (
    <div className="flex items-center gap-3">
      <img src={user.profileImage} className="h-10 w-10 rounded-full object-cover" alt="profile" />
      <div className="flex items-center gap-1">
        <h2 className="truncate text-lg font-light text-white">{user.username}</h2>
        {user.role === 'creator' && <img src={tick} className="h-4" alt="creator" />}
        {user.role === 'vip creator' && <img src={crown} className="h-4" alt="vip" />}
      </div>
    </div>
  );
});

const Dashboard = React.memo(({ socket }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videos, setVideos] = useState([]);
  const [selectedCaller, setSelectedCaller] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatClosing, setIsChatClosing] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [user, setUser] = useState([]);

  const id = localStorage.getItem('id');
  const token = localStorage.getItem('jwtToken');

  // Memoized API call
  const fetchUserData = useCallback(async () => {
    if (!id) return;
    
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/userById/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  }, [id, token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    setVideos(VideoData);
  }, []); // Remove VideoData dependency as it's static

  const handleSlideChange = useCallback((newSlide) => {
    setCurrentSlide(newSlide);
  }, []);

  const currentUser = useMemo(() => {
    return{
      username: videos[currentSlide]?.username,
      profileImage: videos[currentSlide]?.profileImage
    }
  }, [videos, currentSlide])

  const toggleChat = useCallback(() => {
    if (isChatOpen) {
      setIsChatClosing(true);
      setTimeout(() => {
        setIsChatOpen(false);
        setIsChatClosing(false);
      }, 500);
    } else {
      setIsChatOpen(true);
    }
  }, [isChatOpen]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarExpanded(prev => !prev);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isChatOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isChatOpen]);

  const leftSidebarCollapsed = localStorage.getItem('collapsed') === 'true';

  // Memoize complex calculations and class strings
  const mainContentClass = useMemo(() => {
    const baseClass = "relative transition-all";
    const widthClass = isSidebarExpanded && leftSidebarCollapsed
      ? "w-[calc(100vw-520px)] md:w-full"
      : isSidebarExpanded
        ? "w-[calc(100vw-345px)] md:w-full"
        : leftSidebarCollapsed
          ? "w-[calc(100vw-345px)] md:w-full"
          : "w-[calc(100vw-167px)]";
    return `${baseClass} ${widthClass} h-[100vh] mx-auto my-2 md:my-0`;
  }, [isSidebarExpanded, leftSidebarCollapsed]);

  const rightSidebarClass = useMemo(() => {
    return `relative ${isSidebarExpanded ? "w-[250px]" : "w-[70px]"} bg-black h-[100vh] md:hidden p-2 transition-width duration-100 ease-in-out`;
  }, [isSidebarExpanded]);

  const chatContainerClass = useMemo(() => {
    return `fixed bottom-0 ${isSidebarExpanded ? "right-2" : "right-0"} md:hidden w-[728px] h-[calc(100vh-12vh)] rounded-t-lg transition-transform duration-100 ease-in-out ${
      isChatOpen
        ? isChatClosing
          ? "translate-y-full"
          : "translate-y-0"
        : "translate-y-full"
    }`;
  }, [isSidebarExpanded, isChatOpen, isChatClosing]);

  // Memoize VideoCarousel fallback
  const videoCarouselFallback = useMemo(() => (
    <div className="bg-black h-[calc(95vh-184px)] w-full p-3 rounded-sm">
      <div className="h-full w-full bg-gray-800"></div>
    </div>
  ), []);

  return (
    <div className="w-full flex justify-between items-start md:justify-normal md:gap-x-2 md:block font-gotham font-light bg-main-gradient">
      <div className={mainContentClass}>
        <div>
          <Suspense fallback={videoCarouselFallback}>
            <VideoCarousel 
              videos={videos} 
              onSlideChange={handleSlideChange} 
              className="transition-all" 
            />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<p className="h-48 w-full mt-2 bg-gray-800"></p>}>
            <Callers />
          </Suspense>
        </div>
      </div>

      <div className={rightSidebarClass}>
        <div className="font-gotham font-light flex justify-between items-center bg-main-gradient px-3 py-2 rounded-sm mb-2">
          <UserProfileSection user={user} isSidebarExpanded={isSidebarExpanded} />
          <IoMdMenu className="text-white text-2xl cursor-pointer" onClick={toggleSidebar} />
        </div>
        
        <div>
          <img
            src={chat}
            onClick={toggleChat}
            alt="chat"
            className={`absolute h-12 z-10 bottom-4 ${isSidebarExpanded ? "right-5" : "right-2"} cursor-pointer`}
          />
        </div>
        
        {/* {selectedCaller ? (
          <CallerProfile caller={selectedCaller} />
        ) : (
          <> */}
            {videos.length > 0 && isSidebarExpanded && (
              <>
                <UserInfo
                  username={currentUser.username}
                  profileImage={currentUser.profileImage}
                />
                <Suggestions />
              </>
            )}
          {/* </>
        )} */}
      </div>

      <div className={chatContainerClass}>
        <div>
          {(isChatOpen || isChatClosing) && (
            <div className="h-full float-right w-[305px]">
              <Chats
                socket={socket}
                showChatScreen={false}
                shouldNavigate={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Dashboard;