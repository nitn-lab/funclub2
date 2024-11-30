import React, { useState, useEffect } from "react";
import axios from "axios";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ForumIcon from "@mui/icons-material/Forum";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Suggestions = () => {
  const [nearby, setNearby] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const token = localStorage.getItem("jwtToken");
  const loggedInUserId = localStorage.getItem("id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNearbyPeople = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/users`, {
          headers: { authorization: ` ${token}` },
        });
        const userRes = await axios.get(`${BASE_URL}/api/v1/userById/${loggedInUserId}`, {
          headers: { authorization: `${token}` },
        });
        const followedUsersList = userRes.data.data.following;
        const initializedData = res.data.data.map((item) => ({
          ...item,
          isFollowing: followedUsersList.includes(item._id),
          isOnline: Math.random() > 0.5,
        }));
        const filteredData = initializedData.filter((item) =>
          ["creator", "vip creator", "verified creator"].includes(item.role)
        );
        setNearby(filteredData);
        setFollowedUsers(followedUsersList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNearbyPeople();
  }, []);

  const toggleFollow = async (id, isFollowing) => {
    try {
      const endpoint = isFollowing
        ? `${BASE_URL}/api/v1/unfollow/${id}`
        : `${BASE_URL}/api/v1/follow/${id}`;

      await axios.put(endpoint, {}, {
        headers: {
          authorization: `${token}`,
        },
      });
      setNearby((prevData) =>
        prevData.map((item) =>
          item._id === id
            ? { ...item, isFollowing: !isFollowing }
            : item
        )
      );
      setFollowedUsers((prev) =>
        isFollowing
          ? prev.filter((userId) => userId !== id)
          : [...prev, id]
      );
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const filteredNearby = nearby.filter((item) => {
    if (filter === "all") return true;
    if (filter === "online") return item.isOnline;
    if (filter === "offline") return !item.isOnline;
    return true;
  });

  return (
    <>
      <div className="flex justify-end mx-6 xs:mx-1 gap-x-2 mb-3 mt-2">
        <button
          className={`px-3 rounded-md ${filter === "all" ? "bg-violet-500 text-white" : "bg-white text-black"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 rounded-md ${filter === "online" ? "bg-lime-500 text-white" : "bg-white text-black"}`}
          onClick={() => setFilter("online")}
        >
          Online
        </button>
        <button
          className={`px-4 rounded-md ${filter === "offline" ? "bg-red-500 text-white" : "bg-white text-black"}`}
          onClick={() => setFilter("offline")}
        >
          Offline
        </button>
      </div>

      <div className="scrollable-div grid grid-cols-5 md:grid-cols-3 gap-4 mx-4 xs:mx-1 my-1 items-center h-[100vh] overflow-y-auto xs:mt-3 md:pb-44">
        {filteredNearby.map((item, index) => (
          <div key={item._id} className={`relative slide-up`}>
            <div className="relative h-44 w-44 xs:h-28 xs:w-28 cursor-pointer overflow-hidden animate-blob group" style={{ animationDelay:` ${index * 0.4}s` }}>
              <div
                className="absolute top-4 left-14 transform -translate-y-1/2 bg-main-gradient text-white rounded-md px-1 cursor-pointer follow-btn hidden group-hover:flex items-center duration-700"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollow(item._id, item.isFollowing);
                }}
              >
                {item.isFollowing ? (
                  <DoneAllIcon style={{ fontSize: "1rem" }} />
                ) : (
                  <GroupAddIcon style={{ fontSize: "1rem" }} />
                )}
                <span className="ml-1 text-sm">
                  {item.isFollowing ? "Following" : "Follow"}
                </span>
              </div>

              <img
                src={item.profileImage}
                className="h-full w-full object-cover rounded-full"
                alt={item.username}
                onClick={() => navigate(`/dashboard/user/${item._id}`)}
              />

              <div
                className={`absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 ${item.isOnline ? "bg-lime-500 border-lime-500" : "bg-red-500 border-red-500"}`}
              />

              <div className="h-[50%] w-[100%] absolute right-0 -bottom-[100%] bg-[#1f3d4738] opacity-100 backdrop-blur-sm group-hover:bottom-0 duration-700 flex flex-col items-center justify-center">
                <div className="flex items-center gap-x-3">
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
          </div>
        ))}
      </div>
    </>
  );
};

export default Suggestions;