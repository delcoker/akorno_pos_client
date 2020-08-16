import React, {useState} from "react";
import {AppBar, Fab, IconButton, Link, Menu, MenuItem, Toolbar} from "@material-ui/core";
import {
    ArrowBack as ArrowBackIcon,
    MailOutline as MailIcon,
    Menu as MenuIcon,
    NotificationsNone as NotificationsIcon,
    PanTool,
    Person as AccountIcon,
    // Search as SearchIcon,
    Send as SendIcon,
    Cancel as ResetIcon,
} from "@material-ui/icons";
import classNames from "classnames";
// styles
import useStyles from "./styles";
// components
import {Badge, Button, Typography} from "../Wrappers/Wrappers";
import Notification from "../Notification/Notification";
import UserAvatar from "../UserAvatar/UserAvatar";
// context
import {toggleSidebar, useLayoutDispatch, useLayoutState,} from "../../context/LayoutContext";
import {shiftOut, signOut, useUserDispatch} from "../../context/UserContext";

import Img from "react-image";
import Avatar from "@material-ui/core/Avatar";
import {getUser, isAnyShiftActive} from "../../_utils/fetcher";
import ResetPasswordFormDialog from "../../pages/_shared_components/ResetPasswordDialog";
import {textFieldStyle} from "../../_utils/inlineStyles";
// import {getUser} from "../../_utils/fetcher";

const messages = [
    {
        id: 0,
        variant: "warning",
        name: "Kingston Coker",
        message: "Contact Kingston Coker +1 289 996 8088?",
        time: "9:32",
    },
    {
        id: 1,
        variant: "success",
        name: "Lloyd Brown",
        message: "Check out my new Dashboard",
        time: "9:18",
    },
    {
        id: 2,
        variant: "primary",
        name: "Mark Winstein",
        message: "I want rearrange the appointment",
        time: "9:15",
    },
    {
        id: 3,
        variant: "secondary",
        name: "Liana Dutti",
        message: "Good news from sale department",
        time: "9:09",
    },
];


const notifications = [
    {id: 0, color: "warning", message: "Contact Kingston Coker"},
    {
        id: 1,
        color: "success",
        type: "info",
        message: "What is the best way to get ...",
    },
    {
        id: 2,
        color: "secondary",
        type: "notification",
        message: "This is just a simple notification",
    },
    {
        id: 3,
        color: "primary",
        type: "e-commerce",
        message: "12 new orders has arrived today",
    },
];

export default function Header(props) {
    const user = {
        username: localStorage.getItem('username'), //getter(),
        pic: localStorage.getItem('pic'),
        company: "Akorno",
    };

    var classes = useStyles();

    // global
    var layoutState = useLayoutState();
    var layoutDispatch = useLayoutDispatch();
    var userDispatch = useUserDispatch();

    // local
    var [mailMenu, setMailMenu] = useState(null);
    var [isMailsUnread, setIsMailsUnread] = useState(true);
    var [notificationsMenu, setNotificationsMenu] = useState(null);
    var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);
    var [profileMenu, setProfileMenu] = useState(null);
    // var [isSearchOpen, setSearchOpen] = useState(false);

    const [open, setOpen] = React.useState(false);

    // open change password dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            <ResetPasswordFormDialog
                open={open}
                onClose={handleClose}/>

            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        onClick={() => toggleSidebar(layoutDispatch)}
                        className={classNames(
                            classes.headerMenuButton,
                            classes.headerMenuButtonCollapse,
                        )}
                    >
                        {layoutState.isSidebarOpened ? (
                            <ArrowBackIcon
                                classes={{
                                    root: classNames(
                                        classes.headerIcon,
                                        classes.headerIconCollapse,
                                    ),
                                }}
                            />
                        ) : (
                            <MenuIcon
                                classes={{
                                    root: classNames(
                                        classes.headerIcon,
                                        classes.headerIconCollapse,
                                    ),
                                }}
                            />
                        )}
                    </IconButton>
                    <Typography variant="h6" weight="medium" className={classes.logotype}>
                        {user.company} POS / IMS / SMS
                    </Typography>
                    <Typography variant="h4" weight="light" className={classes.logotype} color="secondary">
                        {/*{localStorage.getItem('page')}*/}
                        <i>{props.title.toUpperCase()}</i>
                    </Typography>
                    <div className={classes.grow}/>
                    <Button component={Link} /*href="https://flatlogic.com/templates/react-material-admin-full"*/
                            variant={"outlined"} color={"secondary"} style={{marginRight: 24}}>{user.username}</Button>
                    <IconButton
                        color="inherit"
                        aria-haspopup="true"
                        aria-controls="mail-menu"
                        onClick={e => {
                            setNotificationsMenu(e.currentTarget);
                            setIsNotificationsUnread(false);
                        }}
                        className={classes.headerMenuButton}
                    >
                        <Badge
                            badgeContent={isNotificationsUnread ? notifications.length : null}
                            color="warning"
                        >
                            <NotificationsIcon classes={{root: classes.headerIcon}}/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-haspopup="true"
                        aria-controls="mail-menu"
                        onClick={e => {
                            setMailMenu(e.currentTarget);
                            setIsMailsUnread(false);
                        }}
                        className={classes.headerMenuButton}
                    >
                        <Badge
                            badgeContent={isMailsUnread ? messages.length : null}
                            color="secondary"
                        >
                            <MailIcon classes={{root: classes.headerIcon}}/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        aria-haspopup="true"
                        color="inherit"
                        className={classes.headerMenuButton}
                        aria-controls="profile-menu"
                        onClick={e => setProfileMenu(e.currentTarget)}>
                        {
                            <Avatar alt={user.username}>
                                <Img width={'40px'}
                                     src={[
                                         '/images/users/' + user.pic + '.jpg',
                                         '/images/users/' + user.pic + '.gif',
                                         '/images/users/' + user.pic + '.png',
                                         '/images/users/' + user.pic + ".jpg",
                                         '/images/users/' + user.pic + '.jpeg',
                                         '/images/users/default.svg',
                                     ]}/>
                            </Avatar>
                        }
                    </IconButton>
                    <Menu id="mail-menu"
                          open={Boolean(mailMenu)}
                          anchorEl={mailMenu}
                          onClose={() => setMailMenu(null)}
                          MenuListProps={{className: classes.headerMenuList}}
                          className={classes.headerMenu}
                          classes={{paper: classes.profileMenu}}
                          disableAutoFocusItem>
                        <div className={classes.profileMenuUser}>
                            <Typography variant="h4" weight="medium">
                                New Messages
                            </Typography>
                            <Typography
                                className={classes.profileMenuLink}
                                component="a"
                                color="secondary">
                                {messages.length} New Messages
                            </Typography>
                        </div>
                        {messages.map(message => (
                            <MenuItem key={message.id} className={classes.messageNotification}>
                                <div className={classes.messageNotificationSide}>

                                    <UserAvatar color={message.variant} name={message.name}/>


                                    <Typography size="sm" color="text" colorBrightness="secondary">
                                        {message.time}
                                    </Typography>
                                </div>
                                <div
                                    className={classNames(
                                        classes.messageNotificationSide,
                                        classes.messageNotificationBodySide,
                                    )}
                                >
                                    <Typography weight="medium" gutterBottom>
                                        {message.name}
                                    </Typography>
                                    <Typography color="text" colorBrightness="secondary">
                                        {message.message}
                                    </Typography>
                                </div>
                            </MenuItem>
                        ))}
                        <Fab variant="extended"
                             color="primary"
                             aria-label="Add"
                             className={classes.sendMessageButton}
                        >
                            Send New Message
                            <SendIcon className={classes.sendButtonIcon}/>
                        </Fab>
                    </Menu>
                    <Menu
                        id="notifications-menu"
                        open={Boolean(notificationsMenu)}
                        anchorEl={notificationsMenu}
                        onClose={() => setNotificationsMenu(null)}
                        className={classes.headerMenu}
                        disableAutoFocusItem>
                        {notifications.map(notification => (
                            <MenuItem
                                key={notification.id}
                                onClick={() => setNotificationsMenu(null)}
                                className={classes.headerMenuItem}
                            >
                                <Notification {...notification} typographyVariant="inherit"/>
                            </MenuItem>
                        ))}
                    </Menu>
                    <Menu
                        id="profile-menu"
                        open={Boolean(profileMenu)}
                        anchorEl={profileMenu}
                        onClose={() => setProfileMenu(null)}
                        className={classes.headerMenu}
                        classes={{paper: classes.profileMenu}}
                        disableAutoFocusItem>
                        <div className={classes.profileMenuUser}>
                            <Typography variant="h4" weight="medium">
                                {user.username}
                            </Typography>
                            <Typography
                                className={classes.profileMenuLink}
                                component="a"
                                color="primary"
                                // href="https://flatlogic.com"
                            >
                                {user.username}
                            </Typography>
                        </div>
                        <MenuItem
                            className={classNames(
                                classes.profileMenuItem,
                                classes.headerMenuItem,)}
                            onClick={async () => {
                                if (!window.confirm("Are you sure you want to shift out?")) {
                                    return;
                                }
                                let user = await getUser(localStorage.getItem('token'));

                                let a = await shiftOut(user);
                                if (a) {
                                    alert("Shifted out")
                                } else {
                                    let active_shift = await isAnyShiftActive();

                                    if (active_shift !== null) {
                                        alert(`${active_shift.user.first_name} ${active_shift.user.last_name} is currently on a shift`);
                                        return;
                                    }
                                    alert("You are not on a shift\n");
                                }
                            }}
                        >
                            <PanTool className={classes.profileMenuIcon}/>
                            <Typography
                                gutterBottom
                                className={classes.profileMenuLink}
                                color="secondary"
                                variant={'h5'}
                            >
                                Shift Out
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            className={classNames(
                                classes.profileMenuItem,
                                classes.headerMenuItem,
                            )}
                            onClick={handleClickOpen}>
                            <ResetIcon className={classes.profileMenuIcon}/>
                            <Typography
                                gutterBottom
                                className={classes.profileMenuLink}
                                color="primary"
                                variant={'h5'}
                            >
                                Change Password
                            </Typography>
                        </MenuItem>
                        <MenuItem
                            className={classNames(
                                classes.profileMenuItem,
                                classes.headerMenuItem,
                            )}
                            onClick={() => signOut(userDispatch, props.history)}
                        >
                            <AccountIcon className={classes.profileMenuIcon}
                                         style={textFieldStyle.resize}
                            />
                            <Typography
                                gutterBottom
                                className={classes.profileMenuLink}
                                color="secondary"
                                variant={'h5'}
                            >
                                Log Out
                            </Typography>
                        </MenuItem>
                        {/*<MenuItem*/}
                        {/*    className={classNames(*/}
                        {/*        classes.profileMenuItem,*/}
                        {/*        classes.headerMenuItem,*/}
                        {/*    )}*/}
                        {/*>*/}
                        {/*    <AccountIcon className={classes.profileMenuIcon}/> Tasks*/}
                        {/*</MenuItem>*/}
                        {/*<MenuItem className={classNames(*/}
                        {/*    classes.profileMenuItem,*/}
                        {/*    classes.headerMenuItem,*/}
                        {/*)}>*/}
                        {/*    <AccountIcon className={classes.profileMenuIcon}/> Messages*/}
                        {/*</MenuItem>*/}
                        {/*<MenuItem*/}
                        {/*    className={classNames(*/}
                        {/*        classes.profileMenuItem,*/}
                        {/*        classes.headerMenuItem,*/}
                        {/*    )}>*/}
                        {/*    <div className={classes.profileMenuUser}>*/}
                        {/*        <Typography*/}
                        {/*            className={classes.profileMenuLink}*/}
                        {/*            color="primary"*/}
                        {/*            onClick={() => signOut(userDispatch, props.history)}*/}
                        {/*        >*/}
                        {/*            Sign Out*/}
                        {/*        </Typography>*/}
                        {/*    </div>*/}
                        {/*</MenuItem>*/}
                    </Menu>
                </Toolbar>
            </AppBar>
        </>
    );
}
