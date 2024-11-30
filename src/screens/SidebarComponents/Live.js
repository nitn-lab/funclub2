 import React, { useState } from 'react';
import { MdStar } from 'react-icons/md'; 
import { FaUserAlt } from 'react-icons/fa'; 
import { CiStreamOn } from "react-icons/ci";
import { FaTowerBroadcast } from "react-icons/fa6";

const Live = () => {
  const [activeTab, setActiveTab] = useState("popular");

  const renderContent = () => {
    if (activeTab === "popular") {
      return (
        <div className="grid grid-cols-4 xs:grid-cols-1 md:grid-cols-2  gap-2  w-full ">
          {/* First User: Live Ended Overlay */}
          <div className="relative p-4 md:p-2 rounded-md bg-black h-[23rem]">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#292929] bg-opacity-70 text-white rounded-md xs:rounded-none">
              
              <p className="text-xl">Live Ended</p>
            </div>
            <img
              src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="User"
              className="w-full h-72 rounded-md border-2 border-gray-200"
            />
            <div className="flex items-center mb-3 mt-2">
              <img
                src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="User"
                className="h-9 w-9 rounded-full border-2 border-[#9c8fd0] p-1 mr-3"
              />
              <h3 className="text-white">User 1</h3>
            </div>
          </div>

          {/* Second User: Join Live Button */}
          <div className="relative p-4 md:p-2 rounded-md bg-black h-[23rem]">
            <div className="absolute inset-0 flex items-center justify-center  bg-[#292929] bg-opacity-70 text-white rounded-md xs:rounded-none">
              <button className="bg-main-gradient text-white px-4 py-2 rounded-full ">
               Join Live
              </button>
            </div>
            <img
              src="https://images.pexels.com/photos/12345678/pexels-photo-12345678.jpeg"
              alt="Stream"
              className="w-full h-72 rounded-md border-2 border-gray-200"
            />
            <div className="flex items-center mb-3 mt-2">
              <img
                src="https://images.pexels.com/photos/12345678/pexels-photo-12345678.jpeg"
                alt="User"
                className="h-9 w-9 rounded-full border-2 border-[#9c8fd0] p-1 mr-3"
              />
              <h3 className="text-white">User 2</h3>
            </div>
          </div>

          <div className="relative p-4 md:p-2 rounded-md bg-black h-[23rem]">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#292929] bg-opacity-70 text-white rounded-md xs:rounded-none">
              
              <p className="text-xl">Live Ended</p>
            </div>
            <img
              src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="User"
              className="w-full h-72 rounded-md border-2 border-gray-200"
            />
            <div className="flex items-center mb-3 mt-2">
              <img
                src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="User"
                className="h-9 w-9 rounded-full border-2 border-[#9c8fd0] p-1 mr-3"
              />
              <h3 className="text-white">User 1</h3>
            </div>
          </div>

          <div className="relative p-4 md:p-2 rounded-md bg-black h-[23rem]">
            <div className="absolute inset-0 flex items-center justify-center  bg-[#292929] bg-opacity-70 text-white rounded-md xs:rounded-none">
              <button className="bg-main-gradient text-white px-4 py-2 rounded-full ">
               Join Live
              </button>
            </div>
            <img
              src="https://images.pexels.com/photos/12345678/pexels-photo-12345678.jpeg"
              alt="Stream"
              className="w-full h-72 rounded-md border-2 border-gray-200"
            />
            <div className="flex items-center mb-3 mt-2">
              <img
                src="https://images.pexels.com/photos/12345678/pexels-photo-12345678.jpeg"
                alt="User"
                className="h-9 w-9 rounded-full border-2 border-[#9c8fd0] p-1 mr-3"
              />
              <h3 className="text-white">User 2</h3>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-23vh)] text-white">
          <FaTowerBroadcast className="text-4xl mb-4 animate-ping" />
          <p className="text-xl">Nobody is live near you</p>
        </div>
      );
    }
  };

  return (
    <div className="mx-2">
      {/* Tabs and Go Live Button */}
      <div className="flex items-center justify-between mb-4 w-full  mt-2 font-gotham font-light">
        <div className="flex gap-x-3 xs:gap-x-1.5">
          <button
            className={`px-4 xs:px-1.5 py-2 xs:py-0 rounded-md xs:rounded-sm flex gap-x-2 xs:gap-x-0.5 items-center ${activeTab === "popular" ? "bg-white text-black" : "bg-black text-white"}`}
            onClick={() => setActiveTab("popular")}
          >
            <MdStar className='xs:hidden'/> Popular Streams
          </button>
          <button
            className={`px-4 xs:px-1.5 py-2 xs:py-0 rounded-md xs:rounded-sm flex gap-x-2 xs:gap-x-0.5 items-center ${activeTab === "popular" ? "bg-black text-white" : "bg-white text-black"}`}
            onClick={() => setActiveTab("nearby")}
          >
            <FaUserAlt className='xs:hidden'/> Near You
          </button>
        </div>
        <button className="bg-black text-white px-4 xs:px-1.5 xs:py-0.5 py-2 rounded-md xs:rounded-sm flex gap-x-2 xs:gap-x-0.5 items-center">
          <CiStreamOn className='text-xl xs:text-lg'/> Go Live
        </button>
      </div>

      {/* Content */}
      <div className=" rounded-md scrollable-div overflow-y-auto h-[100vh] bg-main-gradient font-gotham font-light">
        {renderContent()}
      </div>
    </div>
  );
};

export default Live;
