import { Redirect, Route } from "react-router-dom";
import React from "react";
import {useUserState} from "../../context/UserContext";

export default ({ component, ...rest }) => {
    const { isAuthenticated } = useUserState();

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
};