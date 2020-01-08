import {VerticalSplit as ItemIcon} from '@material-ui/icons';

import ItemPage from './Items';
import React from "react";

export default {
    page: ItemPage,
    icon: <ItemIcon/>,
    label: 'Items',
    route: "/app/items"
};
