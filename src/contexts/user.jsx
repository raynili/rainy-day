import { createContext, useState, useEffect } from 'react';

import { onAuthStateChangedListener, createUserDocumentFromAuth } from '../utils/firebase/firebase';

// actual value you want to access
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});


/* Most user setup is in this file, centralized - auth listener of observer pattern */

// provider is the glorified component that leverages useState
// gets access in the top level to some state that is set, currentUser
export const UserProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const value = { currentUser, setCurrentUser };

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user) {
                createUserDocumentFromAuth(user);
            }
            setCurrentUser(user);
        }); // return back a function to stop listening, else memory leak

        return unsubscribe; // unsubscribe when unmount
    }, []); // runs once when component mounts

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}