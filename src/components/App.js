import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";

// context
import { useUserState, useUserDispatch } from "../context/UserContext";
import MyLoginPage from "../pages/login/MyLoginPage";

export default function App() {
    // global
    let { isAuthenticated } = useUserState();

    return (
      <HashRouter>
          <Switch>
              <Route exact path="/" render={() => <Redirect to="/app/dashboard"/>}/>
              <Route exact path="/app" render={() => <Redirect to="/app/dashboard"/>}/>
              <PrivateRoute path="/app" component={Layout}/>
              <PublicRoute path="/login" component={MyLoginPage} context={useUserDispatch()}/>
              <Route component={Error}/>
          </Switch>
      </HashRouter>
    );

    // #######################################################################

    function PrivateRoute({ component, ...rest }) {
        return (
          <Route
            {...rest}
            render={props =>
              isAuthenticated ? (
                React.createElement(component, props)
              ) : (
                <Redirect
                  to={{
                      pathname: "/login",
                      state: {
                          from: props.location,
                      },
                  }}
                />
              )
            }
          />
        );
    }

    function PublicRoute({ component, ...rest }) {
        return (
          <Route
            {...rest}
            render={(props) => {
                props = { ...props, cont: rest.context };
                return (isAuthenticated ? (
                  <Redirect
                    to={{
                        pathname: "/",
                    }}
                  />
                ) : (
                  React.createElement(component, props)
                ));
            }
            }
          />
        );
    }
}
