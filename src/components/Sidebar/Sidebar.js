import React, {useState, useEffect} from "react";
import {Drawer, IconButton, List} from "@material-ui/core";
import {
    Dashboard as DashboardIcon,
    /*AttachMoney as SalesIcon,*/
    // NotificationsNone as NotificationsIcon,
    // FormatSize as TypographyIcon,
    FilterNone as UIElementsIcon,
    // BorderAll as TableIcon,
    QuestionAnswer as SupportIcon,
    LibraryBooks as LibraryIcon,
    HelpOutline as FAQIcon, ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";
import {useTheme} from "@material-ui/styles";
import {withRouter} from "react-router-dom";
import classNames from "classnames";

// styles
import useStyles from "./styles";

// components
import SidebarLink from "./components/SidebarLink/SidebarLink";
import Dot from "./components/Dot";

// context
import {
    useLayoutState,
    useLayoutDispatch,
    toggleSidebar,
} from "../../context/LayoutContext";

// modular page import
// import sales from '../../pages/sales';
// import reports from '../../pages/reports';
// import items from '../../pages/items';
// import inventory from '../../pages/inventory';
// import users from '../../pages/users';
import {renderSideBarRoutes} from "../../_utils/routes";


const structure = [
    {id: 0, label: "Dashboard", link: "/app/dashboard", icon: <DashboardIcon/>},
    ...renderSideBarRoutes(),
    // {id: 10, label: inventory.label, link: inventory.route, icon: inventory.icon},
    // {id: 11, label: users.label, link: users.route, icon: users.icon},
    // {id: 3, label: items.label, link: items.route, icon: <items.icon/>},
    // {id: 11,label: "Typography",link: "/app/typography",
    //     icon: <TypographyIcon/>,},

    // {id: 21, label: "Tables", link: "/app/tables", icon: <TableIcon/>},
    // {
    //     id: 31,
    //     label: "Notifications",
    //     link: "/app/notifications",
    //     icon: <NotificationsIcon/>,
    // },
    {
        id: 41,
        label: "UI Elements",
        link: "/app/ui",
        icon: <UIElementsIcon/>,
        children: [
            {label: "Icons", link: "/app/ui/icons"},
            {label: "Charts", link: "/app/ui/charts"},
            {label: "Maps", link: "/app/ui/maps"},
        ],
    },
    {id: 51, type: "divider"},
    {id: 61, type: "title", label: "HELP"},
    {id: 71, label: "Library", link: "", icon: <LibraryIcon/>},
    {id: 81, label: "Support", link: "", icon: <SupportIcon/>},
    {id: 91, label: "FAQ", link: "", icon: <FAQIcon/>},
    {id: 101, type: "divider"},
    {id: 111, type: "title", label: "PROJECTS"},
    {
        id: 121,
        label: "My recent",
        link: "",
        icon: <Dot size="large" color="warning"/>,
    },
    {
        id: 131,
        label: "Starred",
        link: "",
        icon: <Dot size="large" color="primary"/>,
    },
    {
        id: 141,
        label: "Background",
        link: "",
        icon: <Dot size="large" color="secondary"/>,
    },
];

// console.log(structure2);

function Sidebar({location}) {
    var classes = useStyles();
    var theme = useTheme();

    // global
    var {isSidebarOpened} = useLayoutState();
    var layoutDispatch = useLayoutDispatch();

    // local
    var [isPermanent, setPermanent] = useState(true);

    useEffect(function () {
        window.addEventListener("resize", handleWindowWidthChange);
        handleWindowWidthChange();
        return function cleanup() {
            window.removeEventListener("resize", handleWindowWidthChange);
        };
    });

    return (
        <Drawer
            variant={isPermanent ? "permanent" : "temporary"}
            className={classNames(classes.drawer, {
                [classes.drawerOpen]: isSidebarOpened,
                [classes.drawerClose]: !isSidebarOpened,
            })}
            classes={{
                paper: classNames({
                    [classes.drawerOpen]: isSidebarOpened,
                    [classes.drawerClose]: !isSidebarOpened,
                }),
            }}
            open={isSidebarOpened}
        >
            <div className={classes.toolbar}/>
            <div className={classes.mobileBackButton}>
                <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
                    <ArrowBackIcon
                        classes={{
                            root: classNames(classes.headerIcon, classes.headerIconCollapse),
                        }}
                    />
                </IconButton>
            </div>
            <List className={classes.sidebarList}>
                {structure.map(link => (
                    <SidebarLink
                        key={link.id}
                        location={location}
                        isSidebarOpened={isSidebarOpened}
                        {...link}
                    />
                ))}
            </List>
        </Drawer>
    );

    // ##################################################################
    function handleWindowWidthChange() {
        var windowWidth = window.innerWidth;
        var breakpointWidth = theme.breakpoints.values.md;
        var isSmallScreen = windowWidth < breakpointWidth;

        if (isSmallScreen && isPermanent) {
            setPermanent(false);
        } else if (!isSmallScreen && !isPermanent) {
            setPermanent(true);
        }
    }
}

export default withRouter(Sidebar);
