import { useState } from 'react';
import { createContext } from 'react'

export const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [loggedUser, setLoggedUser] = useState(null)
    return(
        <UserContext.Provider value={{loggedUser, setLoggedUser}}>
            {children}
        </UserContext.Provider>
    )
}