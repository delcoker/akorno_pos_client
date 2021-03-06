import {VerticalSplit as ItemIcon} from '@material-ui/icons';

import ItemPage from './Items';
import React from "react";
import ItemCategoryPg from "../item_category";

export default {
    page: ItemPage,
    icon: <ItemIcon/>,
    label: 'Items',
    route: "/app/items/list",
    exact: true,
    children: [
        {label: "Item List", link: "/app/items/list", page: ItemPage},
        {label: ItemCategoryPg.label, link: ItemCategoryPg.route, icon: ItemCategoryPg.icon, page: ItemCategoryPg.page},
    ]
};
