import React from "react";
import {fetcher, END_SHIFT,} from "../_utils/fetcher";

let UserStateContext = React.createContext();
let UserDispatchContext = React.createContext();

function userReducer(state, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {...state, isAuthenticated: true, isAdmin: action.admin};
        case "SIGN_OUT_SUCCESS":
            return {...state, isAuthenticated: false};
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}

function UserProvider({children}) {
    let [state, dispatch] = React.useReducer(userReducer, {
        isAuthenticated: !!localStorage.getItem("token"),
    });

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}

function useUserState() {
    let context = React.useContext(UserStateContext);
    // console.log('useUserState', 'context', context);
    // var context = (UserStateContext);
    // console.log('context', context);
    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }
    return context;
}

function useUserDispatch() {
    let context = React.useContext(UserDispatchContext);

    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }
    return context;
}

export {UserProvider, useUserState, useUserDispatch, loginUser, signOut};

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError, user) {
    if (!!login && !!password) {
        setTimeout(() => {
            localStorage.setItem('id_token', 1);
            dispatch({type: 'LOGIN_SUCCESS', admin:user.isAdmin});

            history.push('/app/dashboard');

        }, 2000);
    } else {
        dispatch({type: "LOGIN_FAILURE"});
    }
}

export const shiftOut = async (user) => {
    // console.log(user.user_id);
    try {
        let a = await fetcher({
            query: END_SHIFT,
            variables: {user_id: user.user_id}
        });
        return a.data.endShift;
    } catch (e) {
        console.log(e);
    }
};


function signOut(dispatch, history) {
    localStorage.removeItem("id_token");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    dispatch({type: "SIGN_OUT_SUCCESS"});
    history.push("/login");
}
