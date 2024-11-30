import React, {createContext, useState} from 'react';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [id, setId] = useState(null);
    const [userEmail, setUserEmail] =useState("")

    const updateUserId = (id) => {
       setId(id);
    };
    const updateEmail = (userEmail) => {
       setUserEmail(userEmail);
    };

    return (
        <UserContext.Provider value={{id, updateUserId, userEmail, updateEmail}}>
            {children}
        </UserContext.Provider>
    );
};