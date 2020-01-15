import {
    SupervisedUserCircle as UsersIcon,
} from '@material-ui/icons';

import UsersPage from "./Users";
import React from "react";

export default {
    page: UsersPage,
    icon: <UsersIcon/>,
    label: 'Users',
    route: "/app/users"
};
