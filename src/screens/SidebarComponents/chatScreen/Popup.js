import React from "react";
import { Modal } from "react-responsive-modal";
import { FaTimes } from "react-icons/fa";

const Popup = ({ open, handlePopup, logo }) => {
  return (
    <>
      <div>
        <Modal
          onClose={handlePopup}
          open={open}
          center
          closeIcon={
            <FaTimes className="text-2xl p-1.5 float-end bg-[#fd558d] rounded-full text-white" />
          }
          classNames={{
            overlay: { background: "rgba(0, 0, 0, 0.462)" },
            modal: "customModal",
          }}
        >
          <img src={logo} width="80" className="mx-auto" alt="logo"/>
          <div className="text-center mt-5">
            <p className="text-2xl font-semibold italic text-[#fd558d]">
              Only first four chats are free at FUNCLUB!!
            </p>
            <p className="text-xl my-5 leading-loose font-medium">
              To enjoy unlimited chats and to always stay connected with your
              friends
              <br /> get coins from FUNCLUB.
            </p>
            <button className="w-full active:scale-[.98] acitve:duration-75 hover:scale-[1.01] ease-in-out  transition-all py-3 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 text-white text-lg font-bold">
              Get coins
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Popup;
