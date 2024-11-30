import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, useParams } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoComponent from "./VideoComponent";
import tick from '../Global/icons/tick.png';
import crown from '../Global/icons/crown.png';
import { toast } from "react-toastify";
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();
  const loggedInUserId = localStorage.getItem('id');

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id, user, posts]);

  const timeAgo = (createdAt) => {
    const time = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    return time.replace('about', '');
  };

  const fetchUserData = async (id) => {
    try {
      // Fetch user data
      const userResponse = await axios.get(`${BASE_URL}/api/v1/userById/${id}`, {
        headers: { Authorization: `${token}` },
      });
      const userData = userResponse.data.data;
      setUser(userData);
      if (userResponse.data.data.followers.includes(loggedInUserId)) {
        setFollowing(true);
      }
      const postResponse = await axios.get(`${BASE_URL}/api/v1/user/${id}/posts`, {
        headers: { Authorization: `${token}` },
      });
      setPosts(postResponse.data.data);

    } catch (error) {
      if(error.response.status == 403){
        toast.error('Session expired. Please login again!')
        localStorage.removeItem('jwtToken')
        navigate('/')
      }
      console.error("Failed to fetch user data or posts", error);
    }
  };

  const toggleFollow = async () => {
    try {
      const endpoint = following
        ? `${BASE_URL}/api/v1/unfollow/${id}`
        : ` ${BASE_URL}/api/v1/follow/${id}`;

      await axios.put(endpoint, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setFollowing(prevState => !prevState);
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-col items-center w-full mx-auto h-[100vh] scrollable-div overflow-y-auto font-gotham font-light bg-black md:pb-32 xs:overflow-x-hidden">
      {user && (
        <div className="w-full px-5 xs:px-0 py-3 text-white">
          <div className="h-[320px] relative">
            <img
              src="https://gratisography.com/wp-content/uploads/2023/10/gratisography-pumpkin-scarecrow-1170x780.jpg"
              alt="cover photo"
              className="w-[100%] h-64 xs:h-44 object-cover"
            />
            <button className="float-right mt-3 bg-main-gradient px-2 py-1 rounded-md xs:mr-1" onClick={toggleFollow}>  {following ? (
                <DoneAllIcon style={{ fontSize: "1rem" }} />
              ) : (
                <GroupAddIcon style={{ fontSize: "1rem" }} />
              )}
              <span className="ml-1 text-sm">
                {following ? "Following" : "Follow"}
              </span></button>
            
              <img
                src={user.profileImage}
                alt="user img"
                className="w-36 h-36 xs:w-24 xs:h-24 rounded-full object-cover absolute left-0 right-0 m-auto top-[150px] border-2 border-white bg-black mx-auto"
              />
            
          </div>
          <div>
            <div className="w-full flex flex-col items-center justify-center">
              <div className="flex items-start gap-1">
                <h2 className="text-xl font-medium">{user.username}</h2>
                {user.role === 'creator' && <img src={tick} className="h-5" />}
                {user.role === 'vip creator' && <img src={crown} className="h-5" />}
              </div>
              <div className="flex items-center gap-3 my-2 text-fuchsia-500">
                <p>{posts && posts.length} posts</p>
                <p>{user.followers && user.followers.length} followers</p>
                <p>{user.following && user.following.length} following</p>
              </div>
              <h3 className="w-1/2 xs:w-full text-center">{user.bio}</h3>
            </div>
          </div>

          <div className="posts-container w-full mx-auto shadow-lg">
            <div className="w-full mt-3 text-white my-3 sm:w-full">
              {posts && posts.length > 0 ? (
                <div className="my-8 w-full grid grid-cols-2 xs:grid-cols-1 mx-auto h-full gap-5">
                  {posts.slice().reverse().map((post) => (
                    <div
                      key={post._id}
                      className="h-auto p-4 w-full shadow-lg rounded-md bg-gray-900"
                    >
                      <div className="flex items-center gap-3 mb-4 justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profileImage}
                            alt="user img"
                            className="w-[60px] h-[60px] rounded-full object-cover border-2 border-white"
                          />
                          <p>{user.username}</p>
                        </div>
                        <p className="text-sm">{timeAgo(post.createdAt)}</p>
                      </div>
                      <p className="truncate">{post.content}</p>
                      {post.image && (
                        <div className="h-[350px] mt-4  w-full overflow-hidden">
                          <img
                            src={post.image}
                            alt="post image"
                            className="w-full h-full object-cover sm:object-contain border-2 border-white transition-all hover:scale-110 cursor-pointer"
                          />
                        </div>
                      )}
                      {post.video && (
                        <div className="h-[350px] mt-4 w-full overflow-hidden">
                          <VideoComponent
                            src={post.video}
                            className="w-full h-full "
                            poster={`https://gratisography.com/photo/reindeer-dog/`}
                            alt="Post Content"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-full my-44">
                  <div>
                    <div className="ml-7 mb-3">
                      <svg
                        aria-label="When you share photos, they will appear on your profile."
                        className="x1lliihq x1n2onr6 x5n08af"
                        fill="currentColor"
                        height="62"
                        role="img"
                        viewBox="0 0 96 96"
                        width="62"
                      >
                        <title>
                          When you share photos, they will appear on your
                          profile.
                        </title>
                        <circle
                          cx="48"
                          cy="48"
                          fill="none"
                          r="47"
                          stroke="currentColor"
                          strokeMiterlimit="10"
                          strokeWidth="2"
                        ></circle>
                        <ellipse
                          cx="48.002"
                          cy="49.524"
                          fill="none"
                          rx="10.444"
                          ry="10.476"
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="2.095"
                        ></ellipse>
                        <path
                          d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z"
                          fill="none"
                          stroke="currentColor"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-xl font-normal">No posts yet!</h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;