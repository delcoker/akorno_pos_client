import React, {Component} from "react";
import {Button, Grid, TextField,} from "@material-ui/core";
// components
import Widget from "../../components/Widget";
import {fetcher, GET_SHIFT, getUser} from "../../_utils/fetcher";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import GetUsersDropDown from "../_shared_components/GetUsersDropDown";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import {Lock, Print} from "@material-ui/icons";
import useStyles from './styles'
import {textFieldStyle} from "../../_utils/inlineStyles";
import moment from "moment";
import memoizeOne from "memoize-one";

import $ from 'jquery'
import {toast, ToastContainer} from "react-toastify";
import Notification from "../../components/Notification";

const columnsR = memoizeOne((calculateLeftMPHandler, /**, after_mp**/) => [ // cause infinite rerender i think using state
    {name: "Item", selector: "item_name", sortable: true, grow: 4,},
    {name: "Received", selector: "qty_start", sortable: true, grow: 1},
    {
        name: "Added", selector: "qty_during", sortable: true,
        cell: row => row.qty_during ? row.qty_during : 0, grow: 1
    },
    {
        name: "Total", selector: "r_a", sortable: true,
        cell: row => row.qty_during ? row.qty_during + row.qty_start : row.qty_start, grow: 1
    },
    {name: "Qty Sold (Cash)", selector: "qty_sold", sortable: true, grow: 1},
    {
        name: "Total GH₵",
        selector: "item_price * qty_sold",
        sortable: true,
        cell: row => {
            const quantity_sold = (row.qty_start + (row.qty_during ? row.qty_during : 0) - (row.qty_end ? row.qty_end : 0));
            return `${(row.item_price * quantity_sold).toFixed(2)}`;
        }, grow: 1
    },
    {name: "Left", selector: "qty_end", sortable: true, grow: 1,},
    {
        name: "Qty Sold (MP)",
        selector: "mp",
        sortable: true,
        cell: row => {
            return <TextField
                id="mp" name={'meal_plan' + row.id} // label="Total ₵" placeholder="Total ₵"
                inputProps={{style: textFieldStyle.resize, min: 0, max: row.qty_end}}
                type='number'
                color='secondary'
                defaultValue={0}
                onChange={(e) => calculateLeftMPHandler(e, row)}
            />;
        }, grow: 1,
    },
    {
        name: "Left After MP",
        selector: "mp_",
        sortable: true,
        cell: row => {
            // console.log(row);
            return (
                <TextField
                    id={"mp_" + row.id} name={'after_meal_plan' + row.id} // label="Total ₵" placeholder="Total ₵"
                    inputProps={{style: textFieldStyle.resize, readOnly: true, min: "0"}}
                    type='number'
                    color='secondary'
                    defaultValue={row.qty_end}
                    onChange={(e) => console.log(e.target.name)}
                />
            );
        }, grow: 1, //button:true
    },
    {name: "Current Stock", selector: "current_stock", sortable: true, grow: 1},
    {
        name: 'Status', selector: 'status', sortable: true,
        cell: row => row.status === "enabled" ? "on-going" : 'ended'
    },
    {name: 'User', selector: 'user_name', sortable: true, grow: 3},
    {
        name: 'Start Date',
        selector: 'start_date',
        sortable: true,
        grow: 5,
        format: d => moment(parseInt(d.start_date)).format("dd-Do-MM-YY"),
    },
    {
        name: 'End Date',
        selector: 'end_date',
        sortable: true,
        grow: 5,
        format: d => moment(parseInt(d.end_date)).format("dd-Do-MM-YY"),
    },
]);

const lineDelimiter = "<br>";
let classes = null;
let toastOptions = null;

class ShiftReconciliation extends Component {
    constructor(props) {
        super(props);
        this.user = null;
        this.user_id = -1;
        this.state = {
            shifts: [],
            startDate: new Date().setHours(5), // set as six am
            endDate: new Date(),
            user_id: 0,
            book_total: 0,
            after_meal_plan: 0,
        };

        classes = this.props.classes;
        toastOptions = {
            className: classes.notification,
            progressClassName: classes.progress,
        };
    }

    async componentDidMount() {

        let user = await getUser(localStorage.getItem("token"));

        this.setState({user_id: user.user_id});

        this.fetchShifts(this.state.startDate, this.state.endDate, null, this.state.user_id);
    }

    handleStartDateChange = date => {
        this.setState({startDate: date});

        let transactionPoint = null;

        this.fetchShifts(date, this.state.endDate, transactionPoint, this.state.user_id);
    };

    handleEndDateChange = date => {
        this.setState({endDate: date});

        const transactionPoint = null;

        this.fetchShifts(this.state.startDate, date, transactionPoint, this.state.user_id);
    };

    fetchShifts = async (startDate, endDate, transactionPoint, user_id, status) => {

        if (!this.state.user_id) return;

        startDate = new Date(startDate);
        try {
            let res = await fetcher({
                query: GET_SHIFT,
                variables: {
                    user_id: user_id,
                    startDate,
                    endDate,
                    transactionPoint,
                    status,
                }
            });
            const shiftsReceived = res.data.getShift;

            let shifts = [];
            let book_total = 0;
            for (let shift of shiftsReceived) {
                for (let shift_det of shift.shift_details) {
                    book_total += shift_det.item.price * shift_det.qty_sold_during_shift_time_by_anyone;

                    shifts.push({
                        id: shift_det.id,
                        item_name: shift_det.item.name,
                        item_price: shift_det.item.price,
                        qty_start: shift_det.qty_start,
                        qty_during: shift_det.qty_during,
                        qty_sold: shift_det.qty_sold_during_shift_time_by_anyone ? shift_det.qty_sold_during_shift_time_by_anyone : 0,
                        qty_end: shift_det.qty_end,
                        current_stock: shift_det.item.quantity,
                        user_name: `${shift.user.first_name} ${shift.user.last_name}`,
                        status: shift.status,
                        start_date: shift.createdAt,
                        end_date: shift.updatedAt
                    });
                }
            }
            // sort alphabetically
            shifts.sort(this.compare);

            this.setState({shifts, book_total: book_total.toFixed(2)});
        } catch (err) {
            console.log(err);
        }
    };

    compare = (a, b) => {
        const item_nameA = a.item_name.toUpperCase();
        const item_nameB = b.item_name.toUpperCase();

        let comparison = 0;
        if (item_nameA > item_nameB) {
            comparison = 1;
        } else if (item_nameA < item_nameB) {
            comparison = -1;
        }
        return comparison;
    };

    handleRowSelectedChange = (data, value, d, e) => {
        console.log("handleRowSelectedChange", data, value.rowData, d, e);
    };

    handleDropDownChange = e => {
        const {value} = e.target;
        this.user_id = e.target.value;
        this.setState({user_id: value});
        this.fetchShifts(this.state.startDate, this.state.endDate, null, this.user_id);

    };

    handleDropDownHTML = e => {
        console.log(e.target);
    };

    convertArrayOfObjectsToPrint = (header, array, footer) => {

        const itemNameLength = 10;
        const cashierCropLength = 5;

        let result = header + lineDelimiter + lineDelimiter;
        result += `<table border="1px"><tr><th align="left">Item</th><th>St</th><th>Top</th><th>End</th><th>Sld</th><th>Lft</th><th>Cash</th></tr>`;

        for (let i = 0; i < array.length; i++) {
            let start = array[i].item_name.substr(0, itemNameLength);
            let cashierCrop = array[i].user_name.substr(0, cashierCropLength);

            result += `<tr><td>${start}</td><td>${array[i].qty_start}</td>
                    <td>${array[i].qty_during ? array[i].qty_during : 0}</td>
                    <td>${array[i].qty_end}</td>
                    <td>${array[i].qty_start + (array[i].qty_during ? array[i].qty_during : 0) - (array[i].qty_end ? array[i].qty_end : 0)}</td>
                    <td>${array[i].qty_left}</td>
<td>${cashierCrop}</td></tr>`;
        }
        result += "</table>";
        result += footer;

        return result;
    };

    runShiftReport = async () => {
        if (!this.state.shifts || this.state.shifts.length < 1)
            return;

        // get cashier at time of sale
        let user = await getUser(localStorage.getItem("token"));

        if (!user.user_id)
            throw new Error("Could not get user.\nTransaction not saved");

        let company = "AKORNO CATERING SERVICES<br> ";
        let cashier_name = (user.first_name + " " + user.last_name).substr(
            -company.length
        );
        let head = company + "Run By: " + lineDelimiter + cashier_name;
        let report_on = this.state.user_id === -1 ? "Everyone" : cashier_name;

        let foot = lineDelimiter + "Report On:" + report_on;
        foot += "<br/>" + moment((new Date())).format("llll");

        let content = this.convertArrayOfObjectsToPrint(
            head,
            this.state.shifts,
            foot
        );
        if (content == null) return;

        let pri = document.getElementById("contents_to_print").contentWindow;
        pri.document.open();
        pri.document.write(content);
        pri.document.close();

        pri.focus();
        pri.print();
    };

    // #todo
    calculateLeftWithMP = (e, row) => {
        const {value} = e.target;

        if (value < 0) {
            const componentProps = {
                type: "feedback",
                message: `This value cannot be less than 0.`,
                variant: "contained",
                color: "warning",
            };

            toast(<Notification
                {...componentProps}
                className={classes.notificationComponent}
            />, toastOptions);
            return;
        }

        if (row.qty_end - value < 0) {

            const componentProps = {
                type: "feedback",
                message: `The result will be less than 0.`,
                variant: "contained",
                color: "info",
            };

            toast(<Notification
                {...componentProps}
                className={classes.notificationComponent}
            />, toastOptions);
            return;
        }
        const result = row.qty_end - value;
        $('#mp_' + row.id).val(result);
    };

    reconciliation = () => {
        console.log("reconciliation")
    };

    actions = () => [
        <Button key={1}
                onClick={this.reconciliation}
                style={textFieldStyle.resize}
                color='primary' variant="contained"
                startIcon={<Lock/>}
                endIcon={<Lock/>}>MP Reconciliation</Button>
    ];


    render() {
        return (
            <>
                <ToastContainer/>
                <Grid container spacing={1}>

                    <Grid container item spacing={1} xs={12}>
                        <Grid item xs={12}>
                            <Widget disableWidgetMenu>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container spacing={3} justify="space-around">
                                        <Grid item lg={4} md={4} sm={6} xs={12}>
                                            <KeyboardDateTimePicker
                                                fullWidth
                                                inputVariant="outlined"
                                                variant="inline"
                                                format="dd-MMM-yyyy hh:mm a"
                                                margin="normal"
                                                id="start_date"
                                                label="Start Date"
                                                value={this.state.startDate}
                                                onChange={this.handleStartDateChange}
                                                inputProps={{
                                                    style: textFieldStyle.resize,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item lg={4} md={4} sm={6} xs={12}>
                                            <KeyboardDateTimePicker
                                                fullWidth
                                                label="End Date"
                                                inputVariant="outlined"
                                                variant="inline"
                                                margin="normal"
                                                id="end_date"
                                                value={this.state.endDate}
                                                onChange={this.handleEndDateChange}
                                                format="dd-MMM-yyyy hh:mm a"
                                                ampm={true}
                                                inputProps={{
                                                    style: textFieldStyle.resize,
                                                }}
                                            />
                                        </Grid>

                                        <Grid item lg={3} md={3} sm={6} xs={12}>
                                            <GetUsersDropDown
                                                loggedUserId={this.state.user_id}
                                                handleDropDownChange={
                                                    this.handleDropDownChange
                                                }
                                                handleDropDownHTML={this.handleDropDownHTML}
                                            />
                                        </Grid>

                                        <Grid item xs={1}>

                                            <IconButton size="medium"
                                                        style={{
                                                            height: "100px",
                                                            width: "100px"
                                                        }}
                                                        onClick={this.runShiftReport}>
                                                <Print color="secondary"
                                                       fontSize='large'/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </Widget>
                        </Grid>
                    </Grid>
                    <Grid container item spacing={1} xs={12}>
                        <Grid item xs={12}>
                            <DataTable
                                title={"Book Total: GH₵ " + this.state.book_total}
                                columns={columnsR(this.calculateLeftWithMP, this.ref)}
                                data={this.state.shifts}
                                actions={this.actions()}
                                defaultSortField={"start_date"}
                                expandableRows={false}
                                highlightOnHover
                                pointerOnHover
                                striped
                                customStyles={dataTableFont}
                                fixedHeader
                            />
                        </Grid>

                    </Grid>
                    <Grid container item spacing={1} xs={1}>
                    </Grid>
                </Grid>

                <iframe title={'Print Report'} id="contents_to_print"
                        style={{height: "0px", width: "0px", position: "absolute"}}/>

            </>
        );
    }
}

const dataTableFont = {
    cells: {
        style: {
            fontSize: '17px', // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
};

export default useStyles(ShiftReconciliation);


