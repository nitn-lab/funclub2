import React from "react";
import {useNavigate} from 'react-router-dom';
import { useSignOut } from "../../components/context/SignOutContext";
import {Modal} from 'react-responsive-modal';
import {toast} from 'react-toastify';
import {useDispatch} from 'react-redux';

const Signout = () => {
  const {isSignOutPopupOpen, closeSignOutPopup} = useSignOut();
  const navigate = useNavigate();
  if(!isSignOutPopupOpen){
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate("/");
    toast.success("Logged out successfully!!");

  }
 return(
  <>
    
    <Modal
        open={isSignOutPopupOpen}
        onClose={closeSignOutPopup}
        showCloseIcon={false}
        center
        classNames={{
          overlay: { background: "rgba(0, 0, 0, 0.462)" },
          modal: "customModal",
        }}
      >
        <div className="modal-content text-black">
          <h2 className="text-xl font-semibold mb-4 text-center text-black">Confirm Logout</h2>
          <p className="text-center mb-4">Are you sure you want to logout?</p>
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="bg-main-gradient text-white py-2  rounded-full hover:scale-105 w-full"
            >
              Logout
            </button>

          </div>
          <div className="flex justify-center  mt-4">
            <button
              onClick={closeSignOutPopup}
              className="  py-2 rounded-full w-full hover:bg-gray-200 font-bold text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
  </>
 )
};

export default Signout;