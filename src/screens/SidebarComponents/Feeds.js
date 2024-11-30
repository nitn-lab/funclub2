import React, { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { FaHeart, FaBookmark } from "react-icons/fa";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { IoMdHome, IoMdCart } from "react-icons/io";
import LockIcon from "@mui/icons-material/Lock";
import { formatDistanceToNow } from 'date-fns';
import axios from "axios";
import VideoComponent from "./VideoComponent";
import { useNavigate } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import { FaRegComment } from "react-icons/fa";
import LikesModal from "./LikesModal";
import CommentsModal from "./CommentsModal";
import { toast } from "react-toastify";
import tick from '../Global/icons/tick.png';
import crown from '../Global/icons/crown.png';
import FollowersModal from "./Modal";
import Chats from "./chatScreen/Chats";
import FeedsModal from "./FeedsModal";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Feeds = ({ socket }) => {
  const [data, setData] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [tab, setTab] = useState("followers");
  const [activeTab, setActiveTab] = useState("all");
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const loggedInUser = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [currentLikes, setCurrentLikes] = useState([]);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [currentComments, setCurrentComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const logedInuserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/userById/${loggedInUser}`, {
          headers: { authorization: ` ${token}` },
        });
        setFollowing(res.data.data.following);
        setFollowers(res.data.data.followers);
      }
      catch (error) {
        console.error('Failed to fetch user data', error);
        if (error.response.status === 403) {
          toast.error('Session expired. Please login again!')
          localStorage.removeItem('jwtToken');
          navigate('/');
        }
      }
    }
    logedInuserData();
  }, [loggedInUser, token])


  useEffect(() => {
    const getUsersAndPosts = async () => {
      try {

        const res = await axios.get(`${BASE_URL}/api/v1/users`, {
          headers: { authorization: ` ${token}` },
        });
        const users = res.data.data;
        const usersWithPosts = await Promise.all(
          users.map(async (user) => {
            const postsRes = await axios.get(
              `${BASE_URL}/api/v1/user/${user._id}/posts`,
              {
                headers: { authorization: `${token}` },
              }
            );
            return {
              ...user,
              posts: postsRes.data.data || [],
            };
          })
        );
        setData(usersWithPosts);
        setLoading(false)
      } catch (err) {
        console.error("Error fetching users or posts:", err);
        setLoading(false)
      }
    };
    getUsersAndPosts();
  }, []);

  const timeAgo = (createdAt) => {
    const time = formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    return time.replace('about', '')
  }
  const toggleLike = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/like/${id}`,
        {},
        {
          headers: { authorization: ` ${token}` },
        }
      );
      if (res.data.data.likes.includes(loggedInUser)) {
        setLikedPosts((prev) => [...prev, id]);
      } else {
        setLikedPosts((prev) => prev.filter((likeid) => likeid !== id));
      }
      const updatedLikedPosts = data.map((user) => ({
        ...user,
        posts: user.posts.map((post) => {
          if (post._id === id) {
            return { ...post, likes: res.data.data.likes };
          }
          return post;
        }),
      }));
      setData(updatedLikedPosts);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleSave = async (id) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/save/${id}`,
        {},
        {
          headers: { authorization: `${token}` },
        }
      );
      const savedByUsers = res.data.data.saves;
      if (savedByUsers.includes(loggedInUser)) {
        setSavedPosts((prev) => [...prev, id]);
      } else {
        setSavedPosts((prev) => prev.filter((saveid) => saveid !== id));
      }
      const updatedSavedPosts = data.map((user) => ({
        ...user,
        posts: user.posts.map((post) => {
          if (post._id === id) {
            return { ...post, saves: res.data.data.saves };
          }
          return post;
        }),
      }));
      setData(updatedSavedPosts);
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  const renderContent = () => {
    let posts = []
    switch (activeTab) {
      case "shorts":
        posts = data
          .flatMap((user) => user.posts).filter(post => post.video)
        break;
      case "highlights":
        posts = data
          .flatMap((user) => user.posts)
          .filter((post) => post.saves.includes(loggedInUser));
        break;
      // case "purchased":
      //   posts = [];
      //   break;
      default:
        posts = data.flatMap((user) => user.posts);
        break;
    }
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  };

  const handleLikesClick = (post) => {
    if (!likesModalOpen) {
      setCurrentLikes(post.likes);
      setLikesModalOpen(true);
    }
  }
  console.log(data)
  const closeLikesModal = () => {
    setLikesModalOpen(false);
  }

  const handleCommentsClick = (post) => {
    if (!commentsModalOpen) {
      setCurrentComments(post);
      setCommentsModalOpen(true);
    }
  }

  const closeCommentsModal = () => {
    setCommentsModalOpen(false);
  }

  return (
    <div className="font-gotham font-light w-full">
      {/* Tabs */}
      <div className="flex items-start">
        <div className="flex-grow">
          <div className="flex justify-around  mb-2 bg-black text-white py-[6.5px]">
            <button
              className={`${activeTab === "all" ? "border-b-2 border-white" : ""
                } text-lg px-4 xs:px-2 py-2 flex items-center gap-x-2 xs:gap-x-0`}
              onClick={() => setActiveTab("all")}
            >
              <IoMdHome className="xs:hidden" /> Home
            </button>
            <button
              className={`${activeTab === "shorts" ? "border-b-2 border-white" : ""
                } text-lg px-4 xs:px-2 py-2 gap-x-2 flex items-center xs:gap-x-0`}
              onClick={() => setActiveTab("shorts")}
            >
              <FaHeart className="xs:hidden" /> Shorts
            </button>
            <button
              className={`${activeTab === "highlights" ? "border-b-2 border-white" : ""
                } text-lg px-4 xs:px-2 py-2 gap-x-2 flex items-center`}
              onClick={() => setActiveTab("highlights")}
            >
              <FaBookmark className="xs:hidden" /> Highlights
            </button>
            {/* <button
          className={`${activeTab === "purchased" ? "border-b-2 border-white" : ""
            } text-lg px-4 xs:px-2 py-2 gap-x-2 flex items-center`}
          onClick={() => setActiveTab("purchased")}
        >
          <IoMdCart className="xs:hidden" /> Purchased
        </button> */}
          </div>
          <div className="mx-2  mb-2">
          <FeedsModal />
          </div>
          <div className="mx-2 bg-black mb-2 rounded-md sm:rounded-none text-white p-3"><p>Stories</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <div>
            <img src="https://gratisography.com/wp-content/uploads/2023/03/gratisography-dog-in-winter-hat-stock-photo-800x525.jpg"  className="h-16 w-16 rounded-full border-2 border-[#9c8fd0] p-1 object-cover"/>
            <p className="text-sm text-center mt-1 truncate">Jack</p>
            </div>
            <div>
            <img src="https://gratisography.com/wp-content/uploads/2023/04/gratisography-neon-lightbulb-free-stock-photo-800x525.jpg"  className="h-16 w-16 rounded-full border-2 border-[#9c8fd0] p-1 object-cover"/>
            <p className="text-sm text-center mt-1 truncate">Madhu</p>
            </div>
            <div>
            <img src="https://gratisography.com/wp-content/uploads/2023/04/gratisography-heavenly-sky-free-stock-photo-800x525.jpg"  className="h-16 w-16 rounded-full border-2 border-[#9c8fd0] p-1 object-cover"/>
            <p className="text-sm text-center mt-1 truncate ">Rohini</p>
            </div>
            <div>
            <img src="https://gratisography.com/wp-content/uploads/2023/04/gratisography-bow-tie-dog-stock-photo-800x525.jpg"  className="h-16 w-16 rounded-full border-2 border-[#9c8fd0] p-1 object-cover"/>
            <p className="text-sm text-center mt-1 truncate">Palak</p>
            </div>
            <div>
            <img src="https://gratisography.com/wp-content/uploads/2023/05/gratisography-colorful-cat-free-stock-photo-800x525.jpg"  className="h-16 w-16 rounded-full border-2 border-[#9c8fd0] p-1 object-cover"/>
            <p className="text-sm text-center mt-1 truncate">Roshni</p>
            </div>

          </div>
          </div>
          <div className="flex w-full">

            <div className="scrollable-div text-white overflow-y-auto h-[55vh] flex-grow mx-2 sm:mx-0">
              {loading ? <div>
                <div className="bg-black rounded-md sm:rounded-none h-full shadow-lg p-6 mb-3">
                  <div className="flex gap-3 items-center mb-5">
                    <Skeleton variant="circular" width={50} height={50} sx={{ bgcolor: 'grey.900' }} animation="wave" />
                    <Skeleton variant="text" width={150} height={25} sx={{ bgcolor: 'grey.900' }} animation="wave" />
                  </div>
                  <Skeleton variant="rectangular" width="100%" height="65%" sx={{ bgcolor: 'grey.900', borderRadius: "5px" }} animation="wave" />
                  <Skeleton variant="text" width={150} height={25} sx={{ bgcolor: 'grey.900', marginTop: "20px", marginBottom: "10px" }} animation="wave" />
                  <Skeleton variant="text" width="50%" height={25} sx={{ bgcolor: 'grey.900' }} animation="wave" />
                </div> <div className="bg-black rounded-md sm:rounded-none h-full shadow-lg p-6 mb-3">
                  <div className="flex gap-3 items-center mb-5">
                    <Skeleton variant="circular" width={50} height={50} sx={{ bgcolor: 'grey.900' }} animation="wave" />
                    <Skeleton variant="text" width={150} height={25} sx={{ bgcolor: 'grey.900' }} animation="wave" />
                  </div>
                  <Skeleton variant="rectangular" width="100%" height="65%" sx={{ bgcolor: 'grey.900', borderRadius: "5px" }} animation="wave" />
                  <Skeleton variant="text" width={150} height={25} sx={{ bgcolor: 'grey.900', marginTop: "20px", marginBottom: "10px" }} animation="wave" />
                  <Skeleton variant="text" width="50%" height={25} sx={{ bgcolor: 'grey.900' }} animation="wave" />
                </div>
              </div> : renderContent().length > 0 ? (renderContent().map((post) => (
                <div className="bg-black p-4 xs:px-2 rounded-md md:rounded-none mb-3 h-fit w-full" key={post._id}>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-x-3 items-center cursor-pointer" onClick={() => {
                      if (post.createdBy._id !== loggedInUser) {
                        navigate(`/dashboard/user/${post.createdBy._id}`)
                      }
                      else {
                        navigate('/dashboard/profile')
                      }
                    }}>
                      <img
                        src={post.createdBy.profileImage}
                        className="h-11 w-11 rounded-full border-2 border-[#9c8fd0] p-1 object-cover"
                        alt="User avatar"
                      />
                      <div className="flex items-start gap-1">
                        <h2>{post.createdBy.username}</h2>
                        {/* {post.createdBy.role === 'creator' && <img src={tick} className="h-4" />}
        {post.createdBy.role === 'vip creator' && <img src={crown} className="h-4" />} */}
                      </div>
                    </div>
                    <p className=" text-sm">
                      {timeAgo(post.createdAt)}
                    </p>
                  </div>
                  {post.image && <div className="relative w-full h-[27rem] mt-4 mb-2 rounded-md border-2 border-gray-200">
                    {post.image && <img
                      src={post.image}
                      className={`w-full h-full object-cover sm:object-contain rounded-md ${post.isPrivate ? "blur-md" : ""}`}
                      alt="Post Content"
                    />}
                  </div>}
                  {post.video &&
                    <div>
                      {post.video && <VideoComponent
                        src={post.video}
                        className={`w-full h-full mx-auto rounded-md ${post.isPrivate ? "blur-md" : ""}`}
                        poster={`https://gratisography.com/photo/reindeer-dog/`}
                        alt="Post Content"
                      />}
                    </div>
                  }
                  {/* {post.isPrivate && (
                      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 rounded-md">
                        <LockIcon className="text-pink-500" style={{ fontSize: "3rem" }} />
                        <p className="text-xl font-semibold my-2">Private Post</p>
                        <button className="bg-main-gradient text-white py-2 px-4 rounded-full">
                          Buy for 25 Credits
                        </button>
                      </div>
                    )} */}

                    {!post.image && !post.video && <div className="flex items-center gap-x-2 my-4">
                      <p className="text-sm font-lighter">{post.content}</p>
                    </div>}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="cursor-pointer"
                        onClick={() => toggleLike(post._id)}
                      >
                        {post.likes.includes(loggedInUser) ? (
                          <FavoriteIcon style={{ fontSize: "1.5rem", color: "red" }} />
                        ) : (
                          <FavoriteBorderIcon style={{ fontSize: "1.5rem" }} />
                        )}
                      </div>
                      <div className="cursor-pointer">
                        <FaRegComment style={{ fontSize: "1.2rem" }} onClick={() => handleCommentsClick(post)} />
                      </div>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleSave(post._id)}
                    >
                      {post.saves.includes(loggedInUser) ? (
                        <BookmarkIcon style={{ fontSize: "1.5rem", color: "gold" }} />
                      ) : (
                        <BookmarkBorderIcon style={{ fontSize: "1.5rem" }} />
                      )}
                    </div>
                  </div>
                  <div className="mt-1 ml-1">
                    <p className="text-sm cursor-pointer" onClick={() => handleLikesClick(post)}>
                      {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                    </p>
                    
                  </div>
                  {post.image && <div className="flex items-center gap-x-2">
                      <p className="text-sm font-lighter">{post.content}</p>
                    </div>}
                    {post.video && <div className="flex items-center gap-x-2">
                      <p className="text-sm font-lighter">{post.content}</p>
                    </div>}

                </div>)


              )) : (<div className="flex justify-center items-center w-full h-full">
                <div>
                  <div className="ml-7 mb-3">
                    <svg aria-label="When you share photos, they will appear on your profile." class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="62" role="img" viewBox="0 0 96 96" width="62"><title>When you share photos, they will appear on your profile.</title><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></circle><ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" stroke-linejoin="round" stroke-width="2.095"></ellipse><path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg></div>
                  <h2 className="text-xl font-normal">No posts yet!</h2>
                </div>
              </div>)}
            </div>
            {/* <div className="overflow-y-auto scrollable-div bg-black rounded-md p-4 text-white h-fit max-h-[67vh] w-1/3 mr-3 sm:hidden">

<div className="flex justify-around mb-2">
  <button
    className={`${tab === "followers" ? "border-b-2 border-white" : ""
      } text-lg px-4 xs:px-2 py-2 gap-x-2 flex items-center xs:gap-x-0`}
    onClick={() => setTab("followers")}
  >
    Followers
  </button>
  <button
    className={`${tab === "following" ? "border-b-2 border-white" : ""
      } text-lg px-4 xs:px-2 py-2 gap-x-2 flex items-center xs:gap-x-0`}
    onClick={() => setTab("following")}
  >
    Following
  </button>
</div>


{data && data.length > 0 && (
  <div>
    {data
      .filter((user) =>
        tab === "followers"
          ? followers.includes(user._id)
          : following.includes(user._id)
      )
      .map((user) => (
        <div className="flex items-center gap-3 mt-2  px-5 py-4 rounded-md transition-all cursor-pointer hover:bg-fuchsia-800 hover:scale-105" onClick={() => navigate(`/dashboard/user/${user._id}`)}>
          <img src={user.profileImage} alt="img" className="h-10 w-10 rounded-full object-cover bg-white" />
          <div className="flex items-start gap-1">
      <h2 className='truncate'>{user.username}</h2>
      {user.role === 'creator' && <img src={tick} className="h-4"/>}
      {user.role === 'vip creator' && <img src={crown} className="h-4"/>}
      </div>
        </div>
      ))}
    {tab === 'followers' && followers.length === 0 && <p className="text-center py-10">No followers yet.</p>}
    {tab === 'following' && following.length === 0 && <p className="text-center py-10">You don't follow anyone yet.</p>}
  </div>

)}
</div> */}
          </div>
        </div>
        <div className="w-[305px] sm:hidden">
          <Chats className="w-[305px]" socket={socket}
            showChatScreen={false}
            shouldNavigate={true} />
        </div>
      </div>



      <FollowersModal open={likesModalOpen} onClose={closeLikesModal} likes={currentLikes} heading={'Likes'} />
      <CommentsModal open={commentsModalOpen} onClose={closeCommentsModal} post={currentComments} />
    </div>
  );
};

export default Feeds;
