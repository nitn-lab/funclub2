import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { FaTimes } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import tick from '../Global/icons/tick.png';
import crown from '../Global/icons/crown.png';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FollowersModal = ({ open, onClose, likes, heading }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('jwtToken');
    const navigate = useNavigate();
    const loggedInUserId = localStorage.getItem('id');  // ID of the logged-in user

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const userPromises = likes.map(async (userId) => {
                    const res = await axios.get(`${BASE_URL}/api/v1/userById/${userId}`, {
                        headers: { authorization: `${token}` },
                    });
                    setLoading(false)
                    const user = res.data.data;
                    // Add the following status based on whether the logged-in user follows this user
                    user.following = user.followers.includes(loggedInUserId);
                    return user;
                });

                const usersData = await Promise.all(userPromises); // Wait for all promises to resolve
                setUsers(usersData);
            } catch (err) {
                setLoading(false)
                console.error("Error fetching users:", err);
            } 
        };

        if (likes.length > 0) {
            fetchUsers();
        } else {
            setUsers([]);
            setLoading(false);
        }
    }, [likes, token, loggedInUserId]);

    const toggleFollow = async (userId, index) => {
        const user = users[index];
        const endpoint = user.following
            ? `${BASE_URL}/api/v1/unfollow/${userId}`
            : `${BASE_URL}/api/v1/follow/${userId}`;

        try {
            await axios.put(endpoint, {}, {
                headers: { authorization: ` ${token}` },
            });

            // Update the follow status in the local state
            const updatedUsers = [...users];
            updatedUsers[index].following = !user.following;
            setUsers(updatedUsers);
        } catch (error) {
            toast.error("Error updating follow status.");
        }
    };
console.log(users)
    return (
        <Modal open={open} onClose={onClose} center
            closeIcon={
                <FaTimes className="text-xl p-1 float-end  text-white" />
            }
            classNames={{
                overlay: { background: "rgba(0, 0, 0, 0.462)" },
                modal: "customSearchModal",
            }}>
            <div className='py-3 w-full h-full'>
                <h2 className="text-center pb-3 border-b-2 border-[#363636] font-medium">{heading}</h2>
                <ul>
                    {loading && <p>Loading...</p>}
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <li key={index} className='flex items-center justify-between p-3 cursor-pointer rounded-sm mt-3' onClick={() => {
                                if(user._id !== loggedInUserId){
                                    navigate(`/dashboard/user/${user._id}`)
                                }
                                else{
                                    navigate('/dashboard/profile')
                                }
                            }}>
                                <div className='flex items-center gap-3'>
                                    <img src={user.profileImage} alt={user.username} className='h-8 w-8 rounded-full object-cover' />
                                    <div className="flex items-start gap-1">
                                        <h2 className="truncate">{user.username}</h2>
                                        {user.role === 'creator' && <img src={tick} className="h-4" />}
                                        {user.role === 'vip creator' && <img src={crown} className="h-4" />}
                                    </div>
                                </div>
                               {heading === 'Likes' && user._id !== loggedInUserId && <button
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
                        ))
                    ) : (
                        <li className='h-72 flex items-center justify-center'>No users found.</li>
                    )}
                </ul>
            </div>
        </Modal>
    );
};

export default FollowersModal;