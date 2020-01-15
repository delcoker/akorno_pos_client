import React from "react";
import {fetcher, END_SHIFT, getUser,} from "../_utils/fetcher";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
    // console.log(action);
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
    var [state, dispatch] = React.useReducer(userReducer, {
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
    var context = React.useContext(UserStateContext);
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


    // ////////////////////////////// DEL//////////////////////
    // getUser(localStorage.getItem('token')).then(
    //     res => {
    //       // console.log('useUserDispatch', 'context', res);
    //       if(res === null){
    //         localStorage.removeItem("id_token");
    //         localStorage.removeItem("token");
    //         localStorage.removeItem("username");
    //       }
    //     }
    // );
    // // let context = UserDispatchContext;
    // ////////////////////////////// DEL///////////////////

    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }
    return context;
}

export {UserProvider, useUserState, useUserDispatch, loginUser, signOut};

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError, isAdmin) {
    // setError(false);
    // setIsLoading(true);

    // console.log('loginUser', login, password, history, setIsLoading, setError);

    if (!!login && !!password) {

        // console.log('loginUser');


        setTimeout(() => {
            localStorage.setItem('id_token', 1);
            // localStorage.setItem('token', '1');
            // localStorage.setItem('username', '1');
            // setError(null);
            // setIsLoading(false);
            dispatch({type: 'LOGIN_SUCCESS', admin:isAdmin});

            history.push('/app/dashboard');

        }, 2000);
    } else {
        dispatch({type: "LOGIN_FAILURE"});
        // setError(true);
        // setIsLoading(false);
    }
}

// export const isAdmin = async () => {
//     let a = await getUser(localStorage.getItem('token')).then(r=>r.isAdmin);
//     // console.log('aaaaaaaaaaaaaaaaaaaaaaa', a);
//     return a;
// };
//
// // let is = await isAdmin(localStorage.getItem('token')).then(r=>r);
// // console.log(is.isAdmin);
//

export const shiftOut = async (user) => {
    // console.log(user.user_id);
    try {
        let a = await fetcher({
            query: END_SHIFT,
            variables: {user_id: user.user_id}
        });
        // console.log(a);
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
