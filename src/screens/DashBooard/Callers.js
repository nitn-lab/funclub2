import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PhoneIcon from "@mui/icons-material/Phone";
import ForumIcon from "@mui/icons-material/Forum";
import VideocamIcon from "@mui/icons-material/Videocam";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

const Callers = () => {
  const [callers, setCallers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const loggedInUserId = localStorage.getItem("id");
  const navigate = useNavigate();
  const size = useWindowSize();

  useEffect(() => {
    const fetchUsersAndFollowedList = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/users`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const userRes = await axios.get(`${BASE_URL}/api/v1/userById/${loggedInUserId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const followedUsersList = userRes.data.data.following;
        
        setCallers(res.data.data);
        setFollowedUsers(followedUsersList);
      } catch (error) {
        console.error("Error fetching users or followed list:", error);
      }
    };

    fetchUsersAndFollowedList();
  }, [loggedInUserId, token]);

  // Memoize the callers data to optimize re-renders
  const memoizedCallers = useMemo(() => {
    return callers
      .filter(user => user._id !== loggedInUserId && user.role === 'user')
      .slice().reverse().map(user => ({
        ...user,
        isFollowing: followedUsers.includes(user._id),
      }));
  }, [callers, followedUsers, loggedInUserId]);

  const toggleFollow = async (id, isFollowing) => {
    try {
      const endpoint = isFollowing
        ? `${BASE_URL}/api/v1/unfollow/${id}`
        : `${BASE_URL}/api/v1/follow/${id}`;

      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setCallers(prevCallers =>
        prevCallers.map(caller =>
          caller._id === id
            ? { ...caller, isFollowing: !isFollowing }
            : caller
        )
      );
      setFollowedUsers(prev =>
        isFollowing
          ? prev.filter(userId => userId !== id)
          : [...prev, id]
      );
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const displayedCallers = size.width < 1200 ? memoizedCallers.slice(-3) : memoizedCallers.slice(-4);

  const handleCallerClick = (caller) => {
    navigate(`/dashboard/user/${caller._id}`);
  };

  return (
    <div className="caller-container grid grid-cols-4 lg:grid-cols-3 gap-x-2 items-center">
      {displayedCallers && displayedCallers.length > 0 ? displayedCallers.map((caller) => {
        return (
          <div
            key={caller._id} 
            className="caller-profile rounded-md md:rounded-none h-48 md:h-52 cursor-pointer relative overflow-hidden group"
          >
            <img
              src={caller.profileImage}
              className="h-full w-full object-cover rounded-md "
              alt={caller.username}
              loading="lazy"
              onClick={() => handleCallerClick(caller)}
            />
            <div
              className="absolute top-2 left-2 flex items-center bg-main-gradient text-white rounded-md px-2 py-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow(caller._id, caller.isFollowing);
              }}
            >
              {caller.isFollowing ? (
                <DoneAllIcon style={{ fontSize: "1rem" }} />
              ) : (
                <GroupAddIcon style={{ fontSize: "1rem" }} />
              )}
              <span className="ml-1 text-sm">
                {caller.isFollowing ? "Following" : "Follow"}
              </span>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center bg-lime-500 text-white p-2.5 rounded-full"></div>
            <div className="h-[50%] w-[100%] absolute right-0 -bottom-[100%] bg-[#1f3d4738] opacity-100 backdrop-blur-sm rounded-md group-hover:bottom-0 duration-700 flex flex-col items-center justify-center">
              <div className="flex items-center gap-x-3 xs:gap-x-1">
                <div className="bg-main-gradient text-white rounded-full px-2 py-1" onClick={() => navigate('/dashboard/chats')}>
                  <ForumIcon style={{ fontSize: "1.25rem" }} />
                </div>
                <div className="bg-main-gradient text-white px-2 py-1 rounded-full my-3">
                  <PhoneIcon style={{ fontSize: "1.25rem" }} />
                </div>
                <div className="bg-main-gradient text-white px-2 py-1 rounded-full">
                  <VideocamIcon style={{ fontSize: "1.25rem" }} />
                </div>
              </div>
            </div>
          </div>
        );
      }) : (
        <div ></div>
      )}
    </div>
  );
};

export default Callers;