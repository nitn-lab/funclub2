import React, { useState, useEffect, useRef } from 'react';
import camera from '../Global/icons/camera.png'
import video from '../Global/icons/video.png';
import axios from "axios";
import Picker from 'emoji-picker-react';
import { toast } from "react-toastify";
import Modal from 'react-responsive-modal';
import { FaTimes } from "react-icons/fa";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FeedsModal = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [caption, setCaption] = useState("");
    const [postImage, setPostImage] = useState('');
    const [postVideo, setPostVideo] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [user, setUser] = useState({
        username: "",
        followers: [],
        following: [],
        profileImage: ""
    });
    const token = localStorage.getItem('jwtToken');
    const emojiPickerRef = useRef(null); 

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };


    const onEmojiClick = (emojiObject) => {
        setCaption((prevCaption) => prevCaption + emojiObject.emoji);
    };

    const createPost = async (e) => {
        setLoading(true)
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', postImage);
        formData.append('video', postVideo);
        formData.append('content', caption);
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

    const closeModal = () => {
        setOpen(false);
        setPostImage("")
    };

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

    return (
        <div>
            <div>
                <div
                    className="relative h-auto w-full  bg-black rounded-md sm:rounded-none text-white py-2 px-5">
                    <div>
                        <p>Want to share something?</p>
                        <div className="flex items-start mt-1 mb-3 bg-gray-900 px-2 pt-3 rounded-md">
                            <button onClick={toggleEmojiPicker} className="text-main-gradient">
                                😊
                            </button>
                            {showEmojiPicker && (
                                <div ref={emojiPickerRef} className="absolute z-10 top-[5rem]">
                                    <Picker onEmojiClick={onEmojiClick} height={300} width={300} searchDisabled={true} previewConfig={{ showPreview: false }} />
                                </div>
                            )}
                            <textarea autoFocus className="w-full h-auto break-words bg-transparent outline-none border-none  font-light text-sm ml-2" value=
                                {caption} onChange={(e) => setCaption(e.target.value)} />
                            <img src={camera} className="h-7 cursor-pointer" onClick={() => setOpen(true)} />
                        </div>
                        <Modal open={open} onClose={closeModal} center closeOnOverlayClick closeIcon={
                            <FaTimes className="text-2xl p-1.5 float-end bg-main-gradient rounded-full text-white" />
                        } classNames={{
                            overlay: { background: "rgba(0, 0, 0, 0.462)" },
                            modal: "customPostModal",
                        }}>
                            <div className="my-10">
                                {postImage && <div className="flex items-start text-white gap-1 mb-2"><img src={URL.createObjectURL(postImage)} /></div>}
                                {postVideo && <div className="flex items-start text-white gap-1 mb-2"><video src={URL.createObjectURL(postVideo)} autoPlay loop /></div>}
                                <div className="flex items-center justify-around mb-10">
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
                                    <div className="flex items-center gap-2 ">
                                        <input
                                            type="file"
                                            onChange={(e) => { setPostVideo(e.target.files[0]); e.target.value = '' }}
                                            className="hidden w-fit"
                                            id="video-input"
                                        />
                                        <label htmlFor="video-input" className="cursor-pointer text-main-gradient flex items-center w-fit gap-2"><img src={video} className="h-7" />
                                            Videos</label>
                                    </div>

                                </div>
                                {loading ? <span className="loading loading-spinner loading-md float-right"></span> : <button className="px-3 rounded-sm bg-main-gradient float-right" onClick={createPost}>Share</button>}
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedsModal
