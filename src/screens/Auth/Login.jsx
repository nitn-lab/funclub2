import React, { useEffect, useState } from "react";
import LoginForm from "../../components/LoginForm";
import ForgetPasswordForm from "../../components/ForgetPasswordForm";
import logo from "../../assets/images/FUNCLUB logo.png";
import Theme from "../../Theme";
import { useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'

const Login = () => {
  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      navigate("/Dashboard");
    }
  }, [navigate]);


  const handleForgotPasswordClick = () => {
    console.log("clicked")
    setAnimationClass("slide-out-left")
    setTimeout(() => {
      navigate('/forget-password')
      setShowLoginForm(false);
      setAnimationClass("slide-in-right");
    }, 300); 
  };


  const handleBackToLoginClick = () => {
    console.log("clicked")
    setAnimationClass("slide-out-right"); 
    setTimeout(() => {
      setShowLoginForm(true);
      navigate("/")
      setAnimationClass("slide-in-left"); 
    }, 300); 
  };

  return (
    <div className="relative h-screen w-screen xs:h-[93vh] font-gotham overflow-hidden font-light">
      <img
        src="https://images.pond5.com/pink-neon-heart-sign-reflection-footage-167595258_iconl.jpeg"
        className="w-full h-full object-cover bg-no-repeat"
        alt="Background"
      />
      <div className="absolute top-0 xs:p-3 p-20 w-full h-full">
        <div className="flex backdrop-blur-lg rounded-lg bg-black/10 dark:bg-white/10 h-full xs:h-[70%] xs:mt-20">
          <div
            className={`flex items-center justify-center w-1/2 md:w-full h-full ${animationClass}`}
            style={{ animationDuration: "0.3s" }}
          >
            {showLoginForm ? (
              <LoginForm onForgotPassword={handleForgotPasswordClick} />
            ) : (
              <ForgetPasswordForm handleBackToLoginClick={handleBackToLoginClick} />
            )}
          </div>
          <div className="md:hidden relative flex w-1/2 items-center h-full">
            <div className="flex w-full justify-center text-primary-light dark:text-primary-dark">
              <img src={logo} className="w-24 animate-pulse mt-10 -mr-5" alt="FUN CLUB Logo" />
              <div>
                <h1 className="text-4xl font-bold">FUN CLUB</h1>
                <h3 className="text-xl font-semibold mt-2.5 text-center italic">
                  Make Friends, Have Fun
                </h3>
              </div>
            </div>
          </div>
        </div>
        <Theme />
      </div>
    </div>
  );
};

export default Login;