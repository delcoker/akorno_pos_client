import {
    StoreMallDirectory as InventoryIcon,
} from '@material-ui/icons';

import InventoryPage from "./Inventory";
import React from "react";

export default {
    page: InventoryPage,
    icon: <InventoryIcon/>,
    label: 'Inventory',
    route: "/app/inventory"
};
