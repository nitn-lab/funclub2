import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "./context/UserContext"; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginForm({onForgotPassword}) {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false); 

  const navigate = useNavigate();
  const { userEmail, updateEmail } = useContext(UserContext);

  
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
      setRememberMe(true); 
    }
  }, [userEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/login`, {
        email,
        password
      });
      setLoading(false);
      console.log(response)
      if (response.status === 200) {
        localStorage.setItem('jwtToken', response.data.jwtToken);
        toast.success("Successfully logged in!!");
        localStorage.setItem("id",response.data.tokenObject._id);
        
      
        if (rememberMe) {
          updateEmail(email);
        } else {
          updateEmail('');
        }

        navigate('/Dashboard'); 
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        toast.error("Email or password is invalid or incorrect!");
      } else {
        toast.error(error.response.data.error.details[0].message);
      }
    }
  }

  return (
    <div className="w-full h-full text-primary-light dark:text-primary-dark px-6 xs:px-3 xl:py-6 py-24 font-gotham font-light">
      <h1 className="text-4xl font-semibold text-center">Welcome Back</h1>
      <p className="font-medium text-lg md:text-md mt-4 text-center">
        Welcome back! Please enter your details
      </p>
      <div className="mt-8 md:mt-6">
        <div>
          <input
            className="w-full border-2 rounded-lg p-2 mt-1  placeholder-black bg-white text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-3 relative"> {/* Relative positioning for password eye icon */}
          <input
            className="w-full border-2 rounded-lg p-2 mt-1  placeholder-black bg-white text-black"
            placeholder="Password"
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
        <div className="mt-5 flex justify-between items-center">
          <div>
            <input 
              type="checkbox" 
              id="remember" 
              className="bg-white"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)} 
            />
            <label className="ml-2  text-base md:text-sm" htmlFor="remember">
              Remember for now
            </label>
          </div>
          <button
            className="font-medium text-base md:text-sm text-violet-500"
            onClick= { onForgotPassword }
          >
            Forget Password?
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-y-4">
          <button
            onClick={handleLogin}
            className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-2 rounded-xl bg-main-gradient text-md font-medium text-primary-dark text-center"
          >
            {loading ? <span className="loading loading-spinner loading-md"></span> : "Sign In"}
          </button>
        </div>
        <div className="mt-4 flex justify-center items-center">
          <p className=" text-base md:text-sm">Don't have an account?</p>
          <button
            className="text-violet-500 text-base md:text-sm  ml-2"
            onClick={() => { navigate('/register'); }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}