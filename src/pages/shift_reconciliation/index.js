import {
    Timer as ShiftIcon,} from '@material-ui/icons';

import ShiftReconciliationPg from "./ShiftReconciliation";
import React from "react";

export default {
    page: ShiftReconciliationPg,
    icon: <ShiftIcon/>,
    label: 'MP Recon',
    route: "/app/shifts/mp_reconciliation"
};
