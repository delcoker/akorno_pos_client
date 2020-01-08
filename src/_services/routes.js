// dynamically routing
import {Route} from "react-router-dom";
import React from "react";
import ROUTES from '../pages'

export const renderPageRoutes = () => {
    return Object.entries(ROUTES).map((value, i) => {
        // console.log(value[1]);
        return (
            <Route path={value[1].route} component={value[1].page} key={i}/>
        );
    });

// how do i just return without map
    // console.log('break');
    //
    //   let routes = [];
    //   for (const [key, value] of Object.entries(LandingPage)) {
    //       console.log(key, value, value.route);
    //       routes.push(<Route path={value.route} component={value.page} key={key}/>);
    //       break;
    //   }
    //
    //   console.log(routes);
    //   routes.map((route, i) => {
    //       return (
    //           route
    //       );
    //   });
    //   return routes;
};

export const renderSideBarRoutes = () =>
    Object.entries(ROUTES).map((route, i) => (
        {id: (i + 1), label: route[1].label, link: route[1].route, icon: route[1].icon, key: i + 1})
    );