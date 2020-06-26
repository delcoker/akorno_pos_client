// import SalePage from './Sales';
//
// export const Sales = SalePage;

import {AttachMoney as SalesIcon} from '@material-ui/icons';

import SalesPage from './Sales';
import React from "react";
// import Sales2 from './components/Sales2';
// import CategoryEdit from './CategoryEdit';

export default {
    page: SalesPage,
    // page2: Sales2,
    icon: <SalesIcon/>,
    label: 'Sales',
    route: "/app/sales"
};
