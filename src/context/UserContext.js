import React from "react";
// import {getUser} from "../_services/fetcher";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  // console.log('LOGIN_SUCCESS');
  switch (action.type) {
    case "LOGIN_SUCCESS":
      // console.log('LOGIN_SUCCESS');
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  // console.log('UserProviderrrr');
  // console.log(children);
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

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
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
      dispatch({ type: 'LOGIN_SUCCESS' });

      history.push('/app/dashboard');

    }, 2000);
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    // setError(true);
    // setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
