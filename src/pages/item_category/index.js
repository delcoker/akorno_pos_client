import {Vibration as ItemCategoryIcon} from '@material-ui/icons';

import React from "react";
import ItemCategoryPage from "./ItemCategory";

export default {
    page: ItemCategoryPage,
    icon: <ItemCategoryIcon/>,
    label: 'Item Category',
    route: "/app/items/items_category"
};
