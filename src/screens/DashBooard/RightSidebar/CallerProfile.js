import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";

const CallerProfile = ({ caller, onClose }) => {
  return (
    <div className="text-primary-dark bg-main-gradient rounded-md h-full p-3 relative">
      <CloseIcon
        className="absolute top-2 right-2 cursor-pointer"
        onClick={onClose}
      />
      <img src={caller.profile_url} className="h-16 w-16 rounded-full" />
      <div className="text-left mt-1.5 text-base font-semibold border-b-2 border-gray-200 pb-2">
        <h5>Name - {caller.firstname}</h5>
        <h5>Gender - {caller.gender}</h5>
        <h5>City - {caller.city}</h5>
        <h5>Looking For - {caller.lookingFor}</h5>
        <h5>Followers - {caller.followers}</h5>
        <h5>Following - {caller.following}</h5>
      </div>
      <h3 className="text-lg font-semibold my-2">Recent Post</h3>
      <div className="bg-white  rounded-md p-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-x-3 items-center">
                  <img
                    src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600"
                    className="h-12 w-12 rounded-full border-2 border-[#9c8fd0] p-1 "
                  />
                  <h3>{caller.username}</h3>
                </div>
                <button className="border-2 border-white py-1 px-2.5 rounded-lg bg-main-gradient hover:scale-[1.03] mr-1 ">
                  Follow
                </button>
              </div>
              <img
                src={caller.profile_url}
                className="w-full h-[calc(96vh-460px)] mt-3  mb-3 rounded-md border-4 border-black"
              />
              <div className="flex items-center justify-between mx-2">
                <FavoriteBorderIcon style={{ fontSize: "1.5rem", color:"black" }} />
                <ModeCommentOutlinedIcon style={{ fontSize: "1.3rem", color:"black" }} />
              </div>
            </div>
    </div>
  );
};

export default CallerProfile;