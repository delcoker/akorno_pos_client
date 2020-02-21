import {
    StoreMallDirectory as BillsIcon,
} from '@material-ui/icons';

import BillsPage from "./Bills";
import React from "react";
import BillCategoryPg from "../bill_category";

export default {
    page: BillsPage,
    icon: <BillsIcon/>,
    label: 'Bills',
    route: "/app/bills/list",
    children: [
        {label: "Bill List", link: "/app/bills/list", page: BillsPage},
        {label: BillCategoryPg.label, link: BillCategoryPg.route, icon: BillCategoryPg.icon, page: BillCategoryPg.page},
        // {label: "Icons", route: "/app/ui/icons"},
        // {label: "Charts", route: "/app/ui/charts"},
        // {label: "Maps", route: "/app/ui/maps"},
        // {label: "Maps", route: "/app/ui/maps"},
    ]
};