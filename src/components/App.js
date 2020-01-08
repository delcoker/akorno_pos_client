import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// components
import Layout from "./Layout";

// pages
import Error from "../pages/error";
// import Login from "../pages/login";

// context
import { useUserState, useUserDispatch } from "../context/UserContext";
import MyLoginPage from "../pages/login/MyLoginPage";

export default function App() {
    // global
    var { isAuthenticated } = useUserState(); //
    // var isAuthenticated  = localStorage.getItem("id_token"); //

    // console.log('isAuthenticated', isAuthenticated);

    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
                <Route exact path="/app" render={() => <Redirect to="/app/dashboard" />}/>
                <PrivateRoute path="/app" component={Layout} />
                <PublicRoute path="/login" component={MyLoginPage} context={useUserDispatch()}/>
                <Route component={Error} />
            </Switch>
        </HashRouter>
    );

    // #######################################################################

    function PrivateRoute({ component, ...rest }) {
        // console.log('privateRoute', 'isAuthenticated',useUserState(), rest);
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
        // console.log('publicRoute', rest.context,);
        return (
            <Route
                {...rest}
                render={(props) => {
                    // console.log(props);
                    props = {...props, cont:rest.context};
                    // console.log('propppppppppppps', props);
                    return (isAuthenticated ? (
                        <Redirect
                            to={{
                                pathname: "/",
                            }}
                        />
                    ) : (
                        React.createElement(component, props)
                    ))
                }
                }
            />
        );
    }
}
