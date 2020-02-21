import {
    StoreMallDirectory as OrdersIcon,
} from '@material-ui/icons';

import OrdersPage from "./Orders";
import React from "react";

export default {
    page: OrdersPage,
    icon: <OrdersIcon/>,
    label: 'Orders',
    route: "/app/orders"
};
