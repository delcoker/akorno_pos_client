import React from "react";
import {Redirect, Route, Switch, withRouter,} from "react-router-dom";
import classnames from "classnames";
// styles
import useStyles from "./styles";
// components
import Header from "../Header";
import Sidebar from "../Sidebar";
// pages
import Dashboard from "../../pages/dashboard";
import PagesIndex from "../../pages";
import {renderPageRoutes} from "../../_utils/routes";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
// context
import {useLayoutState} from "../../context/LayoutContext";
// import {useUserState} from "../../context/UserContext";
// import Reports from "../../pages/reports";
// import Items from "../../pages/items";
// import Inventory from "../../pages/inventory";
// import Users from "../../pages/users";

// import {useUserState} from "../../context/UserContext";

function Layout(props) {

    const [pageTitle, setPageTitle] = React.useState('No Title');

    var classes = useStyles();
    // global
    var layoutState = useLayoutState();
    // var {isAdmin} = useUserState();
    // console.log(isAdmin);

    // const pageNam = (name) =>{
    //     setPageTitle(name);
    // };

    return (
        <div className={classes.root}>
            <>
                <Header history={props.history} title={pageTitle}/>
                <Sidebar/>
                <div className={classnames(classes.content, {
                    [classes.contentShift]: layoutState.isSidebarOpened,
                })}>
                    <div className={classes.fakeToolbar}/>
                    <Switch>
                        <Route path="/app/dashboard" render={(props) =>
                            <Dashboard {...props}
                                       pageNamFunc={setPageTitle}/>}
                        />

                        {/*<SalesRoute path={LandingPage.Sales.route} component={LandingPage.Sales.page}/>*/}
                        {renderPageRoutes(setPageTitle)}

                        {/*<AdminRoute path={Inventory.route} component={Inventory.page}/>*/}
                        {/*<AdminRoute path={Users.route} component={Users.page}/>*/}

                        <Route path="/app/typography" component={Typography}/>
                        <Route path="/app/tables" component={Tables}/>
                        <Route path="/app/notifications" component={Notifications}/>
                        <Route exact path="/app/ui" render={() => <Redirect to="/app/ui/icons"/>}/>
                        <Route path="/app/ui/maps" component={Maps}/>
                        <Route path="/app/ui/icons" component={Icons}/>
                        <Route path="/app/ui/charts" component={Charts}/>
                    </Switch>
                </div>
            </>
        </div>
    );


    // function AdminRoute({component, ...rest}) {
    //     // console.log('privateRoute', 'isAuthenticated',useUserState(), rest);
    //
    //     return (
    //         <Route
    //             {...rest}
    //             render={props => {
    //                 return isAdmin ? (
    //                     React.createElement(component, props)
    //                 ) : (
    //                     <Redirect
    //                         to={{
    //                             pathname: "/app/sales",
    //                             state: {
    //                                 from: props.location,
    //                             },
    //                         }}
    //                     />
    //                 )
    //             }
    //             }
    //         />
    //     );
    // }
}

export default withRouter(Layout);
