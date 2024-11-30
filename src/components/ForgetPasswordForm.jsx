import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ForgetPasswordForm({handleBackToLoginClick}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
console.log(handleBackToLoginClick)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(password === "" || email === ""){
        toast.error("Email or Password is required!!")
        setLoading(false)
        
      }
     
      else{
        const response = await axios.post(`${BASE_URL}/api/v1/passwordReset`, { email, password });
        setLoading(false);
          if(response.status === 201){
            toast.success("Password reset successfully!!")
            navigate("/")
          }
      }
      
   
    } catch (err) {
      setLoading(false);
      toast.error( err.response.data.message);
    }
  };

  return (
    <div className="w-full h-full text-white px-6 xs:px-3 py-16 font-gotham">
      <h1 className="text-4xl font-semibold text-center">Forgot Password</h1>
      <p className="font-medium text-lg md:text-md mt-4 text-center">
        Please enter your email and new password.
      </p>
      <div className="mt-8 md:mt-6">
        <div>
          <input
            className="w-full border-2 rounded-lg p-2 mt-1 border-none outline-none placeholder-black bg-white text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-3 relative"> 
          <input
            className="w-full border-2 rounded-lg p-2 mt-1  placeholder-black bg-white text-black"
            placeholder="New Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span 
            className="absolute right-3 top-4 cursor-pointer text-black" 
            onClick={() => setShowPassword(!showPassword)}  
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} 
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-y-4">
          <button
            onClick={handleResetPassword}
            className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-2 rounded-xl bg-main-gradient text-base font-base"
          >
           {loading ? (<span className="loading loading-spinner loading-md"></span>):("Reset Password")}
          </button>
          <button onClick={handleBackToLoginClick}>Back to login</button>
        </div>
      </div>
    </div>
  );
}