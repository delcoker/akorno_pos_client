import {
    Timer as ShiftIcon,} from '@material-ui/icons';

import ShiftPage from "./Shifts";
import React from "react";
import ShiftReconciliationPage from "../shift_reconciliation";

export default {
    page: ShiftPage,
    icon: <ShiftIcon/>,
    label: 'Book',
    route: "/app/shifts/list",
    children: [
        {label: "Book", link: "/app/shifts/list", page: ShiftPage},
        {label: ShiftReconciliationPage.label, link: ShiftReconciliationPage.route, icon: ShiftReconciliationPage.icon, page: ShiftReconciliationPage.page},
        // {label: "Icons", route: "/app/ui/icons"},
        // {label: "Charts", route: "/app/ui/charts"},
        // {label: "Maps", route: "/app/ui/maps"},
        // {label: "Maps", route: "/app/ui/maps"},
    ]
};
