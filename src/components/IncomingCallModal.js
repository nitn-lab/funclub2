import React, { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { ImPhoneHangUp } from "react-icons/im";
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const IncomingCallModal = ({ callerId, onAccept, onReject }) => {

  const [user, setUser] = useState({})
  const token = localStorage.getItem('jwtToken');

  const fetchCaller = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/userById/${callerId.from}`, {
        headers: { Authorization: `${token}` },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  }
  useEffect(() => {
    fetchCaller();
  }, [])

  return (
    <div
    style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "black",
        text : "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        zIndex: 1000,
        height: "fit-content",
        width: "fit-content",
      }}
      className="incoming-call-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
    >
      <div className="bg-black p-3 rounded-lg text-center text-white opacity-75">
        <h3 className="text-lg font-medium">Incoming Call from {user.username}</h3>
        <div className="flex justify-center gap-12 mt-4">
          <button 
            onClick={onAccept}
            className="bg-green-500 text-white p-2  hover:bg-green-600 rounded-full"
          >
            <FaPhoneAlt />
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 text-white p-2 hover:bg-red-600 rounded-full"
          >
            <ImPhoneHangUp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
