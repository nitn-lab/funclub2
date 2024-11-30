import React, {useState} from "react";
import ForgetPasswordForm from "../../components/ForgetPasswordForm";
import logo from "../../assets/images/FUNCLUB logo.png";
import { useNavigate } from "react-router-dom";
 
const ForgetPassword = () => {

  const navigate = useNavigate();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [animationClass, setAnimationClass] = useState("");
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
    <div className="relative h-screen w-screen xs:h-[93vh]">
      <img
        src="https://images.pond5.com/pink-neon-heart-sign-reflection-footage-167595258_iconl.jpeg"
        className="w-full h-full object-cover bg-no-repeat"
      />
      <div className="absolute top-0 xs:p-3 p-20 w-full h-full">
        <div className="flex backdrop-blur-lg rounded-lg bg-white/10 h-full xs:h-[75%] xs:mt-20">
          <div  className={`flex items-center justify-center w-1/2 md:w-full h-full ${animationClass}`}
            style={{ animationDuration: "0.3s" }}>
            <ForgetPasswordForm handleBackToLoginClick={handleBackToLoginClick}/>
          </div>
          <div className="md:hidden relative flex w-1/2 items-center h-full">
            <div className="flex w-full  justify-center text-white">
              <img src={logo} className="w-24 animate-pulse mt-10 -mr-5" />
              <div>
                <h1 className="text-4xl font-bold ">FUN CLUB</h1>
                <h3 className="text-xl font-semibold mt-2.5 text-center italic">
                  Make Friends, Have Fun
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;