import React, { createContext, useState, useContext } from "react";


const SignOutContext = createContext();
 
export const SignOutProvider = ({ children }) => {
  const [isSignOutPopupOpen, setIsSignOutPopupOpen] = useState(false);

  const openSignOutPopup = () => setIsSignOutPopupOpen(true);
  const closeSignOutPopup = () => setIsSignOutPopupOpen(false);

  return (
    <SignOutContext.Provider value={{ isSignOutPopupOpen, openSignOutPopup, closeSignOutPopup }}>
      {children}
    </SignOutContext.Provider>
  );
};

export const useSignOut = () => useContext(SignOutContext);