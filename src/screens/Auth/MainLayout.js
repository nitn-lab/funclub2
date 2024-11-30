import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebarr from "../Global/Sidebar";
import CoinIcon from "@mui/icons-material/MonetizationOn"; 
import Signout from "../SidebarComponents/Signout";
import { useSignOut } from "../../components/context/SignOutContext";
import menu from '../Global/icons/menu.png'

const MainLayout = () => {
  const [open, setOpen] = useState(false);
  const [showCoin, setShowCoin] = useState(true);
  const [pageAnimation, setPageAnimation] = useState("opacity-0 blur-sm");
  const [scale, setScale] = useState("scale-0");
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const {isSignOutPopupOpen, closeSignOutPopup} = useSignOut();
  const location = useLocation();

  useEffect(() => {
    if(!token){
      navigate('/');
    }
    else{
      closeSignOutPopup();
    }   
    setTimeout(() => {
      setPageAnimation("opacity-100 blur-0"); 
    }, 100);

  
    setTimeout(() => {
      
      setScale("scale-100"); 
    }, 700); 
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (open && !event.target.closest(`[class*=".md:flex"]`)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [open]);

  
  const handleScreenClick = () => {
    setShowCoin(false);
  };

  useEffect(() => {
    setOpen(false)
  }, [location])

  return (
    <div
      className={`fixed inset-0 md:p-0 bg-main-gradient flex items-start w-full transition-opacity duration-700 ease-out ${pageAnimation}`}
    >
      {/* Sidebar and header */}
      {/* <div className=" md:flex w-full my-2 md:my-0 hidden bg-black">
        <button
          className="hidden md:block text-white"
          onClick={(e) => {e.stopPropagation(); setOpen(!open)}}
        >
          <img src={menu} className="h-6 mt-1 ml-1"/>
        </button>
      </div> */}
      
      {/* Sidebar transition */}
      <div
    className="md:absolute z-20"
      >
        <Sidebarr />
      </div>

      {isSignOutPopupOpen && <Signout/>}

      {/* Main content */}
      <div className="w-full">
        <Outlet />
      </div>

    
      {showCoin && (
        <div
          className="fixed inset-0 bg-[#292929] bg-opacity-50 z-50 flex items-center justify-center"
          onClick={handleScreenClick}
        >
          <div
            className={`text-center transform transition-transform duration-700 ease-out ${scale}`}
          >
            <CoinIcon
              className="text-yellow-400 drop-shadow-[5px_5px_10px_rgba(0,0,0,0.5)]"
              style={{
                textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                fontSize : "4rem"
              }}
            /> 
            <p
              className="text-white mt-4 text-lg text-center w-96  font-normal drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi ipsa inventore eaque quod ipsum provident?
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;