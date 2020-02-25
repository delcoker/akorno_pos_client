// dynamically routing del
import {Route} from "react-router-dom";
import React from "react";
import ROUTES from '../pages'

export const renderPageRoutes = (pageNamFunc) => {
    return Object.entries(ROUTES).map((value, i) => {

        let Comp = value[1].page;

        if (value[1].children) {
            return value[1].children.map((val, i) => {
                let Comp = val.page;
                return (
                    // <Route path={val.link} component={Comp} key={i}/>
                    <Route path={val.link}
                           render={(props) =>
                               <Comp {...props}
                                     pageNamFunc={pageNamFunc(val.label)}
                                     key={i}/>
                           }/>
                );
            });
        } else
            // console.log('value[1]');
            return (
                <Route path={value[1].route} render={(props) =>
                    <Comp {...props}
                          pageNamFunc={pageNamFunc(value[1].label)}
                          key={i + 1}/>}
                       key={i + 1}/>
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

export const renderSideBarRoutes = () => {
    return Object.entries(ROUTES).map((route, i) => {
            if (route[1].children) {
                return {
                    id: (i + 1),
                    label: route[1].label,
                    link: route[1].route,
                    icon: route[1].icon,
                    key: (i + 1),
                    children: route[1].children
                }
            }
            // return route[1].label !== 'Orders' ?
            return {
                id: (i + 1),
                label: route[1].label,
                link: route[1].route,
                icon: route[1].icon,
                key: (i + 1)
            } //: '';
        }
    );
};