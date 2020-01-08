import React from "react";
import {
    Route,
    Switch,
    Redirect,
    withRouter,
} from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// components
import Header from "../Header";
import Sidebar from "../Sidebar";

// pages
import Dashboard from "../../pages/dashboard";
import LandingPage from "../../pages";
import {renderPageRoutes} from "../../_services/routes";
// import Reports from "../../pages/reports";
// import Items from "../../pages/items";
// import Inventory from "../../pages/inventory";

import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";

// context
import {useLayoutState} from "../../context/LayoutContext";
import {useUserState} from "../../context/UserContext";

function Layout(props) {
    var classes = useStyles();

    // global
    var layoutState = useLayoutState();
    var {isAuthenticated} = useUserState();
    // console.log(layoutState);




    return (
        <div className={classes.root}>
            <>
                <Header history={props.history}/>
                <Sidebar/>
                <div className={classnames(classes.content, {
                    [classes.contentShift]: layoutState.isSidebarOpened,
                })}>
                    <div className={classes.fakeToolbar}/>
                    <Switch>
                        <Route path="/app/dashboard" component={Dashboard}/>

                        {renderPageRoutes(LandingPage)}

                        {/*<Route path={LandingPage.Sales.route} component={LandingPage.Sales.page}/>*/}
                        {/*<Route path={LandingPage.Reports.route} component={LandingPage.Reports.page}/>*/}
                        {/*<Route path={LandingPage.Items.route} component={LandingPage.Items.page}/>*/}
                        {/*<Route path={LandingPage.Inventory.route} component={LandingPage.Inventory.page}/>*/}
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
}

export default withRouter(Layout);
