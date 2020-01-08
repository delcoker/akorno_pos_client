import {
    Timer as ShiftIcon,} from '@material-ui/icons';

import ShiftPage from "./Shifts";
import React from "react";

export default {
    page: ShiftPage,
    icon: <ShiftIcon/>,
    label: 'Shifts',
    route: "/app/shifts"
};
