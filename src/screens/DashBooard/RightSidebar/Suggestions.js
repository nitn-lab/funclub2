import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from "axios";
import tick from '../../Global/icons/tick.png';
import crown from '../../Global/icons/crown.png';
import search from '../../Global/icons/search.png';
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Suggestions = () => {
  const [data, setData] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const token = localStorage.getItem("jwtToken");
  const loggedInUserId = localStorage.getItem("id");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async (searchTerm = "") => {
    try {
      setIsLoading(true);
      const userRes = await axios.get(`${BASE_URL}/api/v1/userById/${loggedInUserId}`, {
        headers: { Authorization:` ${token} `},
      });
      const followedUsersList = userRes.data.data.following;
      setFollowedUsers(followedUsersList);

      const res = await axios.get(`${BASE_URL}/api/v1/users`, {
        headers: { Authorization: `${token}` },
      });

      if (res.status === 403) {
        localStorage.removeItem("jwtToken");
        navigate('/');
        return;
      }

      const allUsers = res.data.data;
      if (searchTerm) {
        const searchRes = await axios.get(`${BASE_URL}/api/v1/search?query=${searchTerm}`, {
          headers: { Authorization: `${token}` },
        });
        const enrichedResults = searchRes.data.map(user => ({
          ...user,
          following: user.followers.includes(loggedInUserId),
        }));
        setData(enrichedResults);
      } else {
        const shuffledUsers = allUsers.slice().sort(() => Math.random() - 0.5);
        const filteredData = shuffledUsers.filter(user =>
          ["creator", "verified creator", "vip creator"].includes(user.role) && user._id !== loggedInUserId
        ).slice(0, 6);
        setData(filteredData);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.removeItem("jwtToken");
        toast.error('Session expired. Please login again');
        navigate('/');
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [loggedInUserId, token]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  if(value.length > 0){
    fetchSuggestions(value);
  }
  else{
    fetchSuggestions();
  }
  };

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

      setFollowedUsers(prev =>
        isFollowing
          ? prev.filter(userId => userId !== id)
          : [...prev, id]
      );
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const isUserFollowing = (userId) => {
    return followedUsers.includes(userId);
  };

  const handleSearchClick = () => {
    setSearchMode(true); 
  };

  return (
    <div className="font-light relative">
      <div className="flex justify-between items-center xl:mt-2 mt-5 mb-4">
        {!searchMode ? (
          <>
            <h2 className="font-medium text-lg text-primary-dark transition-all duration-500">
              Suggested for you
            </h2>
            <img src={search} className="h-6 cursor-pointer" onClick={handleSearchClick} />
          </>
        ) : (
          <>
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  autoFocus
                  className="w-full border-none outline-none py-1 px-2 bg-white rounded-md"
                />
                <p onClick={() => { setSearchMode(false); setSearchTerm(""); fetchSuggestions(); }} className="text-white cursor-pointer">x</p>
              </div>
              {isLoading && <p className="text-white">Loading...</p>}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 scrollable-div max-h-96 overflow-y-auto">
        {data && data.length > 0 ? data.map((item) => {
          const isFollowing = isUserFollowing(item._id);
          return (
            <div key={item._id} className="bg-primary-dark rounded-md py-1 hover:scale-[1.01] cursor-pointer text-primary-light h-fit" onClick={() => navigate(`/dashboard/user/${item._id}`)}>

              <div className="flex-col items-center justify-center">
                <div className="ml-6 gap-3 flex justify-center">
                  <img
                    src={item.profileImage}
                    alt={item.username}
                    className="object-cover h-12 bg-black w-12 rounded-full"
                  />
                  {item.role === 'creator' ? <img src={tick} className="h-5" /> : <img src={crown} className="h-5" />}
                </div>
                <div>
                  <h3 className="text-sm mx-3 my-0.5 text-center truncate">
                    {item.username}
                  </h3>
                </div>
              </div>
              <div className="flex justify-center">
                <div
                  className="flex w-fit items-center bg-main-gradient text-white rounded-md px-2 py-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(item._id, isFollowing);
                  }}
                >
                  {isFollowing ? (
                    <DoneAllIcon style={{ fontSize: "1rem" }} />
                  ) : (
                    <GroupAddIcon style={{ fontSize: "1rem" }} />
                  )}
                  <span className="ml-1 text-sm">
                    {isFollowing ? "Following" : "Follow"}
                  </span>
                </div>
              </div>
            </div>
          );
        }): <div className="flex flex-col items-center justify-center h-44 w-56 text-white">
                            <div className="flex relative">
                                <img
                                    src="https://gratisography.com/wp-content/uploads/2024/10/gratisography-foliage-face-800x525.jpg"
                                    alt="placeholder1"
                                    className="w-12 h-12 rounded-full bg-black"
                                    style={{ zIndex: 1, position: 'relative', marginRight: '-10px' }}
                                />
                                <img
                                    src="https://gratisography.com/wp-content/uploads/2024/10/gratisography-foliage-face-800x525.jpg"
                                    alt="placeholder2"
                                    className="w-16 h-16 rounded-full bg-black"
                                    style={{ zIndex: 2, position: 'relative', marginRight: '-10px' }}
                                />
                                <img
                                    src="https://gratisography.com/wp-content/uploads/2024/10/gratisography-foliage-face-800x525.jpg"
                                    alt="placeholder3"
                                    className="w-12 h-12 rounded-full bg-black"
                                    style={{ zIndex: 1, position: 'relative' }}
                                />
                            </div>
                            <p className="mt-1 text-lg">User not found</p>
                        </div>}
      </div>
    </div>
  );
};

export default Suggestions;