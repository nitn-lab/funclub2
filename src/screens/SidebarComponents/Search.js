import React, { useState, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import tick from '../Global/icons/tick.png';
import crown from '../Global/icons/crown.png';
import axios from "axios";
import { toast } from "react-toastify";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SearchModal = ({ isOpen, onClose }) => {
    const location = useLocation()
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('jwtToken');
    const loggedInUserId = localStorage.getItem('id');  // ID of logged-in user

    useEffect(() => {
        // Check if the path is a profile path
        const isProfilePath = location.pathname.startsWith("/dashboard/user/");
        const isMyProfilePath = location.pathname.endsWith('/dashboard/profile')
        
        if (isProfilePath || isMyProfilePath && isOpen) {
          onClose(); // Close modal if navigating to a profile
        }
      }, [location.pathname, onClose, isOpen]);

      useEffect(() => {
    if(!isOpen){
        setSearchTerm('')
    }
      },[isOpen])

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/api/v1/search?query=${value}`, {
                    headers: {
                        authorization: ` ${token}`,
                    },
                });
                // Add following status based on whether the logged-in user follows the user in the results
                const enrichedResults = response.data.map((user) => ({
                    ...user,
                    following: user.followers.includes(loggedInUserId),
                }));

                setSearchResults(enrichedResults);
            } catch (err) {
                console.error("Error fetching search results. Please try again.", err);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const toggleFollow = async (userId, index) => {
        const user = searchResults[index];
        const endpoint = user.following
            ? `${BASE_URL}/api/v1/unfollow/${userId}`
            : `${BASE_URL}/api/v1/follow/${userId}`;

        try {
            await axios.put(endpoint, {}, {
                headers: { authorization: `${token}` },
            });

            // Update the follow status in the local state
            const updatedResults = [...searchResults];
            updatedResults[index].following = !user.following;
            setSearchResults(updatedResults);
        } catch (error) {
            toast.error("Error updating follow status.");
        }
    };

    return (
        <>
            <Modal
                onClose={onClose}
                open={isOpen}
                center
                closeIcon={
                    <FaTimes className="text-xl p-1 float-end  text-white" />
                }
                classNames={{
                    overlay: { background: "rgba(0, 0, 0, 0.462)" },
                    modal: "customSearchModal",
                }}
            >
               <div className="w-full">
               <div className="flex items-center gap-2 py-4 pl-3">
                    <IoIosSearch style={{ fontSize: "1.5rem" }} />
                    <h3 className=" text-xl">Search</h3>
                </div>
                <div className="">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        autoFocus
                        className="w-full border-none outline-none p-2 bg-black mb-4"
                    />

                    {isLoading && <p>Loading...</p>}

                    {searchResults.length > 0 && searchTerm !== "" && !isLoading && (
                        <ul className="">
                            {searchResults.map((user, index) => (
                                <li key={index} className="px-3 py-4  cursor-pointer flex justify-between items-center" onClick={() => {
                                if(user._id !== loggedInUserId){
                                    navigate(`/dashboard/user/${user._id}`)
                                }
                                else{
                                    navigate('/dashboard/profile')
                                }
                            }}>
                                    <div className="flex gap-3 items-center">
                                        <img src={user.profileImage} alt={user.username} className="w-8 h-8 rounded-full bg-black object-cover" />
                                        <div className="flex items-start gap-1">
                                            <h2 className='truncate'>{user.username}</h2>
                                            {user.role === 'creator' && <img src={tick} className="h-4" />}
                                            {user.role === 'vip creator' && <img src={crown} className="h-4" />}
                                        </div>
                                    </div>
                                   {user._id !== loggedInUserId && <button
                                        className="bg-main-gradient px-1 py-0.5 rounded-md"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFollow(user._id, index);
                                        }}
                                    >
                                        {user.following ? (
                                            <DoneAllIcon style={{ fontSize: "1rem" }} />
                                        ) : (
                                            <GroupAddIcon style={{ fontSize: "1rem" }} />
                                        )}
                                        <span className="ml-1 text-sm">
                                            {user.following ? "Following" : "Follow"}
                                        </span>
                                    </button>}
                                </li>
                            ))}
                        </ul>
                    )}

                    {searchTerm !== "" && searchResults.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center h-64">
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
                            <p className="mt-4 text-lg">User not found</p>
                        </div>
                    )}
                </div>
               </div>
            </Modal>
        </>
    );
};

export default SearchModal;