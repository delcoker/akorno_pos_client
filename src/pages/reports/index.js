import {Assignment as AssignmentIcon} from '@material-ui/icons';

import ReportPage from './Reports';
import React from "react";

export default {
    page: ReportPage,
    icon: <AssignmentIcon/>,
    label: 'Reports', // used for sidebar and page title
    route: "/app/reports"
};
