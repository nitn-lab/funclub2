import React, { useContext, useState, useEffect, useRef } from "react";
import PaidIcon from '@mui/icons-material/Paid';
import axios from "axios";
import { toast } from "react-toastify";
import camera from '../Global/icons/camera.png'
import video from '../Global/icons/video.png';
import tick from '../Global/icons/tick.png';
import pen from '../Global/icons/pen.png';
import crown from '../Global/icons/crown.png'
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom'
import VideoComponent from "./VideoComponent";
import Picker from 'emoji-picker-react';
import FollowersModal from "./Modal";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Profile = () => {
  const navigate = useNavigate()
  const id = localStorage.getItem("id");
  const [user, setUser] = useState({
    username: "",
    followers: [],
    following: [],
    profileImage: ""
  });
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem('jwtToken');
  const [loading, setLoading] = useState(false);
  const [postImage, setPostImage] = useState('');
  const [postVideo, setPostVideo] = useState('');
  const [caption, setCaption] = useState("");
  const [currentLikes, setCurrentLikes] = useState([]);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
            setShowEmojiPicker(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

  const onEmojiClick = (emojiObject) => {
    setCaption((prevCaption) => prevCaption + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/user/${id}/posts`,
          {
            headers: { authorization: `${token}` },
          }
        );
        setPosts(res.data.data)
      }
      catch (err) {
        if (err.response.status === 403) {
          localStorage.removeItem('jwtToken')
          navigate('/')
        }
      }
    }
    fetchPosts();
  }, [id]);

  const timeAgo = (createdAt) => {
    const time = formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    return time.replace('about', '')
  }

  const fetchUserData = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/userById/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setLoading(false);
      setUser(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      if (error.response.status === 403) {
        toast.error('Session expired. Please login again!')
        localStorage.removeItem('jwtToken')
        navigate('/')
      }
      else {
        toast.error("Error fetching user data. Plaese try again later!!")
      }
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const fields = [
      user.username,
      user.about,
      user.ethnicity,
      user.country,
      user.sexual_orientation,
      user.smoking,
      user.drinking,
      user.personality,
    ];
    const filledFields = fields.filter((field) => field !== "" && field !== "No data");
    const progress = (filledFields.length / fields.length) * 100;
    return progress;
  };
  const createPost = async (e) => {
    setLoading(true)
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', postImage);
    formData.append('video', postVideo);
    formData.append('content', caption);
    console.log(formData.get('video', video))
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/create`, formData, {
        headers: { Authorization: `${token}` },
      });
      setLoading(false)
      toast.success('Post created successfully!!')
      setUser((prev) => ({ ...prev, posts: res.data.data }))
      setCaption("")
      setPostImage("")
      setPostVideo("")
    } catch (error) {
      setLoading(false)
      toast.error('Error creating post. Please try again later!!')
      console.error("Error creating post:", error);
    }
  };

  const uploadImage = async (e) => {
    const imageFile = e.target.files[0];

    const formData = new FormData()
    formData.append("profileImage", imageFile);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/upload/profile-image`, formData, {
        headers: {
          Authorization: `${token}`
        }
      }
      )
      console.log(res.data)
      updateProfileImage(res.data.imageUrl);
      e.target.value = ''
    }
    catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const updateProfileImage = async (image) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/v1/updateUsers/${id}`, { profileImage: image }, {
        headers: { Authorization: `${token}` },
      })
      console.log(res.data, image)
      setUser(res.data.data)
    } catch (error) {
      console.error('Failed to update user data!!', error);

    }
  }

  const deletePost = async (postId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/deletePost/${postId}`, {
        headers: { Authorization: `${token}` }
      });
      console.log(res, "100")
      toast.success("Post deleted successfully!");
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      toast.error("Error deleting post. Please try again later.");
      console.error("Error deleting post:", error);
    }
  };

  const handleLikesClick = (data, heading) => {
    if (!likesModalOpen) {
      setHeading(heading)
      setCurrentLikes(data);
      setLikesModalOpen(true);
    }
  }

  const closeLikesModal = () => {
    setLikesModalOpen(false);
  }

  const scrollToSection = () => {
    const section = document.getElementById("posts");
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full h-[100vh]  bg-black">
      <div className="flex-col items-center  h-full scrollable-div overflow-y-auto overflow-x-hidden font-gotham font-light ">
        {user ? <div className="w-full px-5 sm:px-0 py-3  text-white">
          <div className="h-80 xs:h-64 relative">
            <img src="https://gratisography.com/wp-content/uploads/2023/10/gratisography-pumpkin-scarecrow-1170x780.jpg" alt="cover photo" className="w-[100%]  h-64 xs:h-44 object-cover" />
            <button className="float-right mt-3 bg-main-gradient px-2 py-1 rounded-md xs:mr-1" onClick={() => navigate('/dashboard/update')}>Edit Profile</button>
            <input type="file" id="fileInput" className="hidden" onChange={uploadImage} />
            <img src={user.profileImage} alt="user img" className="w-36 h-36 xs:w-24 xs:h-24  rounded-full object-cover absolute left-0 right-0 m-auto top-[150px] border-2 border-white bg-black" />
            <label htmlFor="fileInput" className=" absolute right-4 m-auto top-4 p-1.5 xs:p-1 bg-white rounded-full cursor-pointer">
              <img src={pen} className="h-6 xs:h-5 object-cover" />

            </label>
            <label htmlFor="fileInput" className="absolute left-32 xs:left-24 right-0 m-auto top-[170px] xs:top-40 bg-white p-1.5 xs:p-1 w-fit rounded-full  cursor-pointer">
              <img src={pen} className="h-6 xs:h-5 object-cover " />

            </label>
          </div>
          <div>
            <div>
              <div className="w-full flex flex-col items-center justify-center">
                <div className="flex items-start gap-1">
                  <h2 className="text-xl font-medium">{user.username}</h2>
                  {user.role === 'creator' && <img src={tick} className="h-5" />}
                  {user.role === 'vip creator' && <img src={crown} className="h-5" />}
                </div>
                <div className="flex items-center gap-3 my-2 text-fuchsia-500">
                  <a onClick={scrollToSection} className="cursor-pointer">{posts.length} posts</a>
                  <p onClick={() => handleLikesClick(user.followers, 'Followers')} className="cursor-pointer">{user.followers.length} followers</p>
                  <p onClick={() => handleLikesClick(user.following, 'Following')} className="cursor-pointer">{user.following.length} following </p>
                </div>
                <h3 className="w-1/2 xs:w-full text-center">{user.bio}</h3>
              </div>
            </div>
          </div>
          <div className="w-full mt-6 rounded-full shadow-lg flex gap-x-4 h-full">
            <div className="w-2/3 sm:w-full">
              <div
                className="relative h-auto w-full bg-gray-900 rounded-md text-white  p-5">
                <div>
                  <p>Want to share something?</p>

                  <div className="flex items-start mt-1 mb-3 bg-black px-2 pt-3 rounded-md">
                  <button onClick={toggleEmojiPicker} className="text-main-gradient">
                    😊
                  </button>
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute z-10 top-20">
                      <Picker onEmojiClick={onEmojiClick} height={300} width={300} searchDisabled={true} previewConfig={{showPreview: false}}/>
                    </div> 
                  )}
                  <textarea autoFocus className="w-full h-auto break-words bg-transparent outline-none border-none  font-light text-sm ml-2" value=
                    {caption} onChange={(e) => setCaption(e.target.value)} />
                  
                  </div>


                  {postImage && <div className="flex items-start text-white gap-1"><img src={URL.createObjectURL(postImage)} /><div className="cursor-pointer" onClick={() => setPostImage("")}>&times;</div></div>}
                  {postVideo && <div className="flex items-start text-white gap-1"><video src={URL.createObjectURL(postVideo)} autoPlay loop /><div  className="cursor-pointer" onClick={() => setPostVideo("")}>&times;</div></div>}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={(e) => { setPostImage(e.target.files[0]); e.target.value = '' }}
                        className="hidden w-fit"
                        id="file-input"
                      />
                      <label htmlFor="file-input" className="cursor-pointer text-main-gradient flex items-center w-fit gap-2"><img src={camera} className="h-7" />
                        Photos</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={(e) => { setPostVideo(e.target.files[0]); e.target.value = '' }}
                        className="hidden w-fit"
                        id="video-input"
                      />
                      <label htmlFor="video-input" className="cursor-pointer text-main-gradient flex items-center w-fit gap-2"><img src={video} className="h-7" />
                        Videos</label>
                    </div>
                    {loading ? <span className="loading loading-spinner loading-md"></span> : <button className="px-3 py-1.5 rounded-md bg-main-gradient" onClick={createPost}>Share</button>}
                  </div>
                </div>
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="w-1/3 sm:hidden text-white h-fit bg-main-gradient p-2 rounded-md">
              <div className="mb-2">
                <div className=" flex gap-1 items-center">
                  <PaidIcon className="text-yellow-300" style={{ fontSize: "2.5rem" }} />
                  <p className="text-base my-2">200</p>
                </div>
                <button className="bg-black px-2 rounded-lg py-1 mt-4">Buy Credits</button>
              </div>
              <div>
                <p className="mt-0.5">Your profile is {calculateProgress().toFixed(0)}% complete</p>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div className="h-2 bg-white  rounded-full my-2.5" style={{ width: `${calculateProgress()}%` }}></div>
                </div>
                <div className="my-4">
                </div>
              </div>
            </div>
          </div>
          <div id="posts" className="posts-container w-full mx-auto shadow-lg ">
            <div className="w-full mt-3 text-white  my-3 sm:w-full ">
              {posts.length > 0 ? (<div className=" my-8 w-full grid grid-cols-2 xs:grid-cols-1 mx-auto h-full gap-5">
                {posts && posts.slice().reverse().map(post => {
                  return (
                    <div className="h-auto p-4 w-full shadow-lg rounded-md bg-gray-900">
                      <div className="flex items-center gap-3 mb-4 justify-between">
                        <div className="flex items-center gap-3">
                          <img src={user.profileImage} alt="user img" className="w-[60px] h-[60px] sm:h-[40px] rounded-full object-cover  border-2 border-white" />
                          <div>
                            <p className="text-xl">{user.username}</p>
                            <p className="font-light text-sm">{timeAgo(post.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">

                          <button className="bg-main-gradient rounded-md hover:scale-105 px-1.5 py-1" onClick={() => deletePost(post._id)}>Delete</button>

                        </div>
                      </div>
                      <p className="truncate">{post.content}</p>
                      <div className="h-[350px] mt-4  w-full overflow-hidden">
                        {post.image && <img src={post.image} alt="image" className="w-full h-full object-cover sm:object-contain transition-all hover:scale-110 cursor-pointer border-2 border-white" />}
                        {post.video && (
                          <VideoComponent
                            src={post.video}
                            className="w-full h-full cursor-pointer"
                            poster={`https://gratisography.com/photo/reindeer-dog/`}
                            alt="Post Content"
                          />
                        )}
                      </div>
                    </div>)
                }
                )}
              </div>) : (
                <div className="flex justify-center items-center w-full h-full my-44">
                  <div>
                    <div className="ml-7 mb-3">
                      <svg aria-label="When you share photos, they will appear on your profile." class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="62" role="img" viewBox="0 0 96 96" width="62"><title>When you share photos, they will appear on your profile.</title><circle cx="48" cy="48" fill="none" r="47" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></circle><ellipse cx="48.002" cy="49.524" fill="none" rx="10.444" ry="10.476" stroke="currentColor" stroke-linejoin="round" stroke-width="2.095"></ellipse><path d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg></div>
                    <h2 className="text-xl font-normal">No posts yet!</h2>
                  </div>
                </div>)}
            </div>
          </div>
        </div> : <div>Login first to see profile.</div>}

      </div>
      <FollowersModal open={likesModalOpen} onClose={closeLikesModal} likes={currentLikes} heading={heading} />
    </div>
  );
};

export default Profile;