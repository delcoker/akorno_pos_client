import {Vibration as BillCategoryIcon} from '@material-ui/icons';

import React from "react";
import BillCategoryPage from "./BillCategory";

export default {
    page: BillCategoryPage,
    icon: <BillCategoryIcon/>,
    label: 'Bill Category',
    route: "/app/bills/bill_category"
};
