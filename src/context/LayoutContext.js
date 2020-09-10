import React from "react";
import {getUser} from "../_utils/fetcher";

var LayoutStateContext = React.createContext();
var LayoutDispatchContext = React.createContext();

function layoutReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function LayoutProvider({ children }) {
  var [state, dispatch] = React.useReducer(layoutReducer, {
    isSidebarOpened: true,
  });
  return (
    <LayoutStateContext.Provider value={state}>
      <LayoutDispatchContext.Provider value={dispatch}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
}

function useLayoutState(/*Added param del*/ history  ) {
  var context = React.useContext(LayoutStateContext);

  /////////////////////////// DEL//////////////////////
  // console.log(history);
  getUser(localStorage.getItem('token')).then(
      res => {
        // console.log('useUserDispatch', 'context', res);
        if(res === null){
          localStorage.removeItem("id_token");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          window.location.replace("/");
        }
      }
  );
  ////////////////////////////// DEL///////////////////

  if (context === undefined) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context;
}

function useLayoutDispatch() {
  var context = React.useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
  }
  return context;
}

export { LayoutProvider, useLayoutState, useLayoutDispatch, toggleSidebar };

// ###########################################################
function toggleSidebar(dispatch) {
  dispatch({
    type: "TOGGLE_SIDEBAR",
  });
}
