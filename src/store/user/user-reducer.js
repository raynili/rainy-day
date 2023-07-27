import { USER_ACTION_TYPES } from "./user-types";

const INITIAL_STATE = {
    currentUser: null
};

export const userReducer = ( state = INITIAL_STATE, action ) => {
    // must set initial state since there is no useReducer hook to set it anymore (like in context)
    const { type, payload } = action;

    switch(type) {
        case USER_ACTION_TYPES.SET_CURRENT_USER:
            return {
                ...state,
                currentUser: payload,
            }
        default:
            return state;
    }
};