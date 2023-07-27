import { createContext, useState, useEffect, useReducer } from 'react';

import { onAuthStateChangedListener, createUserDocumentFromAuth } from '../utils/firebase/firebase';

import { createAction } from '../utils/reducer/reducer';

// actual value you want to access
export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
});

export const USER_ACTION_TYPES = {
    'SET_CURRENT_USER': 'SET_CURRENT_USER'
}

const userReducer = ( state, action ) => {
    const { type, payload } = action;

    switch(type) {
        case USER_ACTION_TYPES.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: payload,
            }
        default:
            throw new Error(`Unhandled type ${type} in userReducer`);
    }
};

const INITIAL_STATE = {
    currentUser: null
};

/* Most user setup is in this file, centralized - auth listener of observer pattern */

// provider is the glorified component that leverages useState
// gets access in the top level to some state that is set, currentUser
export const UserProvider = ({ children }) => {
    // const [ currentUser, setCurrentUser ] = useState(null); // no more useState after useReducer with redux
    const [ state, dispatch ] = useReducer(userReducer, INITIAL_STATE);

    const currentUser = { state };
    const setCurrentUser = (user) => {
        dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));
    }
    
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

/* Reducers are functions that return back an object (object determines the state) */

/*

const userReducer = (state, action) => {
    return {
        currentUser: null,
    }
}

*/