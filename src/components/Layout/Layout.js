import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import classnames from "classnames";
// styles
import useStyles from "./styles";
// components
import Header from "../Header";
import Sidebar from "../Sidebar";
// pages
import Dashboard from "../../pages/dashboard";
import { renderPageRoutes } from "../../_utils/routes";
import Typography from "../../pages/typography";
import Notifications from "../../pages/notifications";
import Maps from "../../pages/maps";
import Tables from "../../pages/tables";
import Icons from "../../pages/icons";
import Charts from "../../pages/charts";
// context
import { useLayoutState } from "../../context/LayoutContext";

function Layout(props) {

    const [pageTitle, setPageTitle] = React.useState("No Title");

    let classes = useStyles();
    // global
    let layoutState = useLayoutState();

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

                      {renderPageRoutes(setPageTitle)}

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
