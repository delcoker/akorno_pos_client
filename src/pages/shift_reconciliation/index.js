import {
    Timer as ShiftIcon,} from '@material-ui/icons';

import ShiftPage from "./Shifts";
import React from "react";

export default {
    page: ShiftPage,
    icon: <ShiftIcon/>,
    label: 'Book',
    route: "/app/shifts"
};
