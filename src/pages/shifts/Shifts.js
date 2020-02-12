import React, {Component} from "react";
import {Button, Grid, TextField,} from "@material-ui/core";
// components
import Widget from "../../components/Widget";
import {fetcher, GET_SHIFT, getUser, MP_RECONCILIATION} from "../../_utils/fetcher";
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

// styles
// import useStyles from "./styles";
// import {withStyles} from "@material-ui/core/styles"
// import PageTitle from "../../components/PageTitle";
// import InputAdornment from "@material-ui/core/InputAdornment";

let backG = 'rgba(63, 195, 128, 0.9)';
let yellowG = 'rgba(242, 217, 132, 1)';
const col = 'white';

const columnsR = memoizeOne((calculateLeftMPHandler, username,/**, after_mp**/) => [ // cause infinte rerender i think using state
    {name: "Item", selector: "item_name", sortable: true, grow: 4, compact: true, cell: row => row.item_name},
    {
        name: "Received", selector: "qty_start", sortable: true, grow: 1, right: false,
        style: {
            backgroundColor: backG,
            color: col
        },
    },
    {
        name: "Added", selector: "qty_during", sortable: true,
        cell: row => row.qty_during ? row.qty_during : 0, grow: 1,
        style: {
            backgroundColor: backG,
            color: col
        },
    },
    {
        name: "Total", selector: "r_a", sortable: true,
        cell: row => row.qty_during ? row.qty_during + row.qty_start : row.qty_start, grow: 1
    },
    {
        name: "Qty Sold Start-End (Cash)", selector: "qty_start_minus_end", sortable: true, grow: 1,
        style: {
            backgroundColor: backG,
            color: col
        },
    },
    {
        name: "MP Sold (Cash-PC)", selector: "qty_mp_sold_on_cash_pc", sortable: true, grow: 1,
        style: {
            backgroundColor: yellowG,
            color: col,
        },
    },
    {name: "Qty Sold Everyone (Cash)", selector: "qty_sold_during_time", sortable: true, grow: 1},
    {name: `Qty Sold (Cash-${username.substring(0, 4)})`, selector: "qty_sold_by_user", sortable: true, grow: 1},
    {
        name: "Total Cash GH₵",
        selector: "subtotal_cash_sales",
        sortable: true,
        // right: true,
        // cell: row => {
        //     // const quantity_sold = (row.qty_start + (row.qty_during ? row.qty_during : 0) - (row.qty_end ? row.qty_end : 0));
        //     return `${(row.item_price * row.qty_start_minus_end).toFixed(2)}`;
        // },
        grow: 1
    },
    {
        name: "End", selector: "qty_end", sortable: true, grow: 1,
        style: {
            backgroundColor: backG,
            color: col
        },
    },
    {
        name: "Qty Sold (MP)",
        selector: "qty_mp_reconciliation",
        sortable: true,
        cell: row => {
            // if (row.qty_mp_reconciliation > 0) {
            //     backG = yellowG;
            // }
            // console.log(row);
            return <TextField
                id="mp" name={'meal_plan' + row.id} // label="Total ₵" placeholder="Total ₵"
                inputProps={{style: textFieldStyle.resize, min: 0, max: row.qty_end, readOnly: row.mp_reconciliation_status !== "enabled"}}
                type='number' color='secondary'
                defaultValue={row.qty_mp_reconciliation}
                onChange={(e) => {
                    calculateLeftMPHandler(e, row);
                }}
            />;
        }, grow: 1, //button:true
        // when: row => row.qty_mp_reconciliation ,
        style: {
            backgroundColor: 'rgba(255, 195, 128, 0.9)',
            color: 'white',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    },
    {
        name: "Left After MP",
        selector: "qty_after_mp_reconciliation",
        sortable: true,
        cell: row => {
            // console.log(row);
            return (
                <TextField
                    id={"mp_" + row.id} name={'after_meal_plan' + row.id} // label="Total ₵" placeholder="Total ₵"
                    inputProps={{style: textFieldStyle.resize, readOnly: true, min: "0"}}
                    type='number'
                    color='secondary'
                    // inputRef={ref => reff = ref}
                    // disabled
                    // value={after_mp} // cause infinite rerender i think
                    defaultValue={row.qty_after_mp_reconciliation}
                    onChange={(e) => console.log(e.target.name)}
                />
            );
        }, grow: 1, //button:true
    },
    {name: "Current Stock", selector: "current_stock", sortable: true, grow: 1},
    {
        name: 'Status', selector: 'status', sortable: true, compact: true,
        cell: row => row.status === "enabled" ? "on-going" : 'ended', grow: 1
    },
    {
        name: 'MP Status', selector: 'mp_reconciliation_status', sortable: true, compact: true, grow: 1,
        cell: row => row.mp_reconciliation_status === "enabled" ? "not reconciled" : 'reconciled'
    },
    {name: 'User', selector: 'user_name', sortable: true, cell: row => row.user_name,},
    {
        name: 'Start Date',
        selector: 'start_date',
        sortable: true,
        grow: 1,
        cell: d => moment(parseInt(d.start_date)).format("dd-Do-MM-YY"),
    },
    {
        name: 'End Date',
        selector: 'end_date',
        sortable: true,
        grow: 1,
        cell: d => moment(parseInt(d.end_date)).format("dd-Do-MM-YY"),
    },
]);

const lineDelimiter = "<br>";
let classes = null;
let toastOptions = null;

class Shifts extends Component {
    constructor(props) {
        super(props);
        this.user = null;
        this.user_id = -1;
        this.state = {
            shifts: [],
            startDate: new Date().setHours(2), // set as six am
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
        // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh", user)
        // this.user_id = this.user ? this.user.user_id : 0;
    }

    handleStartDateChange = date => {
        this.setState({startDate: date});

        // comment this out on deployment
        /////////// -------------------fix this #todo
        let transactionPoint = null;
        //////////// --------------------------------

        this.fetchShifts(date, this.state.endDate, transactionPoint, this.state.user_id);
    };

    handleEndDateChange = date => {
        this.setState({endDate: date});

        /////////// -------------------fix this #todo
        const transactionPoint = null;
        // const vendor = 1;
        //////////// --------------------------------

        this.fetchShifts(this.state.startDate, date, transactionPoint, this.state.user_id);
    };

    fetchShifts = async (startDate, endDate, transactionPoint, user_id, status) => {
        // console.log(startDate, endDate, transactionPoint, user_id);

        if (!this.state.user_id) return;

        startDate = new Date(startDate);
        // endDate = new
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
            // console.log(res);
            const shiftsReceived = res.data.getShift;

            let shifts = [];
            let book_total = 0;
            for (let shift of shiftsReceived) {
                for (let shift_det of shift.shift_details) {
                    // console.log(shift_det);
                    book_total += shift_det.item.price * (shift_det.qty_sold_by_user ? shift_det.qty_sold_by_user : 0);

                    shifts.push({
                        id: shift_det.id,
                        shift_id: shift.id,
                        item_id: shift_det.item.id,
                        item_name: shift_det.item.name,
                        item_price: shift_det.item.price,
                        qty_start: shift_det.qty_start,
                        qty_during: shift_det.qty_during,
                        qty_sold_during_time: shift_det.qty_sold_during_shift_time_by_anyone ? shift_det.qty_sold_during_shift_time_by_anyone : 0, // should come from db transaction table
                        subtotal_cash_sales: (shift_det.item.price * (shift_det.qty_sold_by_user ? shift_det.qty_sold_by_user : 0)).toFixed(2),
                        qty_sold_by_user: shift_det.qty_sold_by_user ? shift_det.qty_sold_by_user : 0,
                        qty_end: shift_det.qty_end,
                        qty_start_minus_end: (shift_det.qty_start + (shift_det.qty_during ? shift_det.qty_during : 0) - (shift_det.qty_end ? shift_det.qty_end : 0)),
                        current_stock: shift_det.item.quantity,
                        user_name: `${shift.user.first_name} ${shift.user.last_name}`,
                        status: shift.status,
                        start_date: shift.createdAt,
                        end_date: shift.updatedAt,

                        qty_mp_reconciliation: shift_det.mp_reconciliation,// ? shift_det.mp_reconciliation : 0,
                        qty_after_mp_reconciliation: shift_det.after_mp_reconciliation, // ? shift_det.after_mp_reconciliation : shift_det.qty_end,
                        mp_reconciliation_status: shift_det.mp_reconciliation_status,
                        qty_mp_sold_on_cash_pc: shift_det.qty_mp_sold_on_cash_pc ? shift_det.qty_mp_sold_on_cash_pc : 0,
                    });
                }
            }
            // sort alphabetically
            shifts.sort(this.compare);
            // console.log(shifts);

            this.setState({shifts, book_total: book_total.toFixed(2)});
        } catch (err) {
            console.log(err);
        }
    };

    compare = (a, b) => { // source: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
        // Use toUpperCase() to ignore character casing
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
        // console.log(e.nativeEvent.target);

        this.fetchShifts(this.state.startDate, this.state.endDate, null, this.user_id);

    };

    handleDropDownHTML = e => {
        // const {value} = e.target;
        // // this.user_id = e.target.value;
        // // this.setState({user_id: value});
        console.log(e.target);

        // this.fetchShifts(this.state.startDate, this.state.endDate, null, this.user_id);

    };

    convertArrayOfObjectsToPrint = (header, array, footer) => {

        const itemNameLength = 10;
        const cashierCropLength = 5;

        let result = header + lineDelimiter + lineDelimiter;
        result += `<table border="1px"><tr><th align="left">Item</th><th>St</th><th>Top</th><th>End</th><th>Sld</th><th>Lft</th><th>Cash</th></tr>`;

        for (let i = 0; i < array.length; i++) {
            // console.log(array[i].item_name);
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
        // console.log(result);
        result += footer;

        return result;
    };

    runShiftReport = async () => {
        // console.log("here", this.state.transactions);
        if (!this.state.shifts || this.state.shifts.length < 1)
            return;

        // get cashier at time of sale
        let user = await getUser(localStorage.getItem("token"));

        if (!user.user_id)
            throw new Error("Could not get user.\nTransaction not saved");

        let company = "AKORNO CATERING SERVICES<br> ";
        // let vendor = 1;
        // let transaction_point = null;
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


        // this.deleteSelectedRows(null, ids);
        // this.setState({ amount: 0 });
        // }
    };

    // #todo
    calculateLeftWithMP = (e, row) => {
        const {value} = e.target;
        // console.log("calculating MP minus", row);
        // console.log(name, value);

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

        // value is Qty Sold MP
        let should_be_left = row.qty_end - value;// + row.qty_mp_sold_on_cash_pc;
        if (should_be_left < 0) {

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
            // $('#mp_' + row.id).val(result);
            return;
        }

        const result = should_be_left;

        /////////////////// update shift state///////////////////////////
        // let shifts = [...this.state.shifts];
        const newShiftState = this.state.shifts.map((shift) => {
            if (shift.id === row.id) {
                shift = {
                    ...row,
                };
                shift.qty_mp_reconciliation = parseInt(value);
                shift.qty_after_mp_reconciliation = result;
            }
            return shift;
        });
        // console.log(newShiftState);
        // console.log(shifts);
        // console.log(row.id);
        /////////////////////////////////////////////////////////////////


        //
        // console.log($('.after_meal_plan' + row.id).val());
        // console.log($('#mp_' + row.id).val());

        $('#mp_' + row.id).val(result);  // changing with vanillaJS

        this.setState({shifts: newShiftState});

        // this.setState({after_meal_plan:result}); // causes infinite rerender i think using state
        // console.log(result);

        // return value;
        // this.setState({meal_plan: value});
    };

    reconciliation = async () => {

        if (!(window.confirm(`Are you sure?
This action cannot be undone`))) {
            return;
        }

        let componentProps = {};


        let shift_detail_ids = [];
        let mp_rec_status = [];
        let mp_qtys_sold = [];
        let mp_qtys_left = [];
        let mp_item_ids = [];
        let shift_ids = [];

        let i = 0;
        for (let shift of this.state.shifts) {


            //#todo
            if(shift.qty_mp_reconciliation && (shift.mp_reconciliation_status==='enabled')) {
                shift_detail_ids[i] = shift.id;
                mp_qtys_sold[i] = shift.qty_mp_reconciliation;
                mp_qtys_left[i] = shift.qty_after_mp_reconciliation;
                mp_rec_status[i] = shift.mp_reconciliation_status;
                mp_item_ids[i] = shift.item_id;
                shift_ids[i] = shift.shift_id;
                i++;
                // if (i===5) break;
            }
        }
        // console.log(shift_detail_ids.length );

        if (shift_detail_ids.length < 1) {
            componentProps = {
                type: "info",
                message: 'Nothing to update',
                color: "warning",
            };
            componentProps.variant = "contained";
            toast(<Notification
                {...componentProps}
                className={classes.notificationComponent}
            />, toastOptions);
            return;
        }
        // console.log(shift_detail_ids, mp_rec_status, mp_qtys_sold, mp_qtys_left);

        try {
            let res = await fetcher({
                query: MP_RECONCILIATION,
                variables: {
                    shift_detail_ids,
                    mp_qtys_sold,
                    mp_qtys_left,
                    mp_rec_status,
                    mp_item_ids,
                    shift_ids
                }
            });


            if (res && res.errors) {
                componentProps = {
                    type: "report",
                    message: res.errors[0].message,
                    color: "secondary",
                };
            } else {
                componentProps = {
                    type: "shipped",
                    message: 'MP Reconciliation Success',
                    color: "success",
                };
            }


            // console.log(res);
        } catch (e) {


        }


        componentProps.variant = "contained";
        toast(<Notification
            {...componentProps}
            className={classes.notificationComponent}
        />, toastOptions);
    };

    actions = () => [
        // this.subHeaderComponentMemo(1),
        // <IconButton color="primary" key={1} onClick={this.reconciliation}>
        <Button key={1} //fullWidth
                onClick={this.reconciliation}
                style={textFieldStyle.resize}
                color='primary' variant="contained"
                startIcon={<Lock/>}
                endIcon={<Lock/>}>MP Reconciliation</Button>

        // </IconButton>
    ];


    render() {
        // const {classes, theme} = this.props;
        return (
            <>
                <ToastContainer/>
                {/*<PageTitle title=""/>*/}

                <Grid container spacing={1}>

                    <Grid container item spacing={1} xs={12}>
                        <Grid item xs={12}>
                            <Widget disableWidgetMenu>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container spacing={3} justify="space-around">
                                        <Grid item lg={4} md={4} sm={6} xs={12}>
                                            <KeyboardDateTimePicker
                                                // disableToolbar
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
                                                        onClick={this.runShiftReport}
                                            >
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
                                columns={columnsR(this.calculateLeftWithMP, this.state.user_id > 0 && this.state.shifts[0] ? this.state.shifts[0].user_name : 'Everyone')}
                                data={this.state.shifts}
                                actions={this.actions()}
                                // selectableRows // add for checkbox selection
                                // selectableRowsComponent={Checkbox}
                                // selectableRowsComponentProps={{ inkDisabled: true }}
                                // onRowSelected={this.handleChange}
                                defaultSortField={"item_name"}
                                // clearSelectedRows={this.state.toggledClearRows}
                                expandableRows={false}
                                highlightOnHover
                                pointerOnHover
                                striped
                                customStyles={dataTableFont}
                                // onRowClicked={this.handleRowClicked}
                                // contextActions={contextActions(this.deleteSelectedRows)}
                                // pagination
                                fixedHeader
                                fixedHeaderScrollHeight='56vh'
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
            fontSize: '18px', // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
};

// export default withStyles(useStyles, {withTheme: true})(MyLoginPage);
export default useStyles(Shifts);


