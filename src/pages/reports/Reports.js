import React, {Component} from "react";
import {Grid} from "@material-ui/core";

// components
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";

import {fetcher, GET_REPORT, getUser} from "../../_utils/fetcher";
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import GetUsersDropDown from "../_shared_components/GetUsersDropDown";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import {Print} from "@material-ui/icons";
import {textFieldStyle} from "../../_utils/inlineStyles";
import useStyles from './styles'

const columnsR = [
    {name: "Item", selector: "item_name", sortable: true},
    {name: "Type", selector: "item_category", sortable: true},
    {name: "Quantity Sold", selector: "qty_sold", sortable: true},
    {
        name: "Total",
        selector: "total",
        sortable: true,
        cell: row => {
            return `${(row.qty_sold * row.item_price).toFixed(2)}`;
        }
    },
    {name: "Left In Stock", selector: "inv", sortable: true}
];

const lineDelimiter = "<br>";
const typeDelimiter = "-";

class Reports extends Component {
    constructor(props) {
        super(props);
        this.user = null;
        this.user_id = -1;
        this.state = {
            transactions: [],
            startDate: new Date().setHours(5), // set as six am
            endDate: new Date(),
            user_id: 0
        };
        // console.log(user_id, startDate, endDate)
        // let user = getUser(localStorage.getItem('token'))
        // if (!user.user_id) throw new Error("Could not get user.\nCould not run report");

        // console.log(this.state.user)
    }

    async componentDidMount() {
        let user = await getUser(localStorage.getItem("token"));
        // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh", user)
        // this.user_id = this.user ? this.user.user_id : 0;
        this.setState({user_id: user.user_id});

        this.fetchTransactions(this.state.startDate, this.state.endDate, null, this.state.user_id);
    }

    handleStartDateChange = date => {
        this.setState({startDate: date});

        // comment this out on deployment
        /////////// -------------------fix this #todo
        let transactionPoint = null;
        //////////// --------------------------------

        this.fetchTransactions(date, this.state.endDate, transactionPoint, this.state.user_id);
    };

    handleEndDateChange = date => {
        this.setState({endDate: date});

        /////////// -------------------fix this #todo
        let transactionPoint = null;
        //////////// --------------------------------

        this.fetchTransactions(this.state.startDate, date, transactionPoint, this.state.user_id);
    };

    fetchTransactions = async (startDate, endDate, transactionPoint, user_id) => {
        // console.log(startDate, endDate, transactionPoint, user_id);

        if (!this.state.user_id) return;

        startDate = new Date(startDate);
        // endDate = new
        try {
            let res = await fetcher({
                query: GET_REPORT,
                variables: {
                    user_id: user_id,
                    startDate,
                    endDate,
                    transactionPoint
                }
            });
            // console.log(res);
            let transactions = res.data.getDailyReport;
            // sort alphabetically
            transactions.sort(this.compare);

            this.setState({transactions});
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
        this.fetchTransactions(this.state.startDate, this.state.endDate, null, this.user_id);
    };

    convertArrayOfObjectsToPrint = (header, array, footer) => {
        // array.sort((a, b) => (a.item > b.item ? 1 : -1));

        const itemNameLength = 13;

        let result = header + lineDelimiter + lineDelimiter;
        result += '<table border="1px"><tr><th align="left">Item</th><th>Ty</th><th>Qty</th><th>Total</th><th>Inv</th></tr>';

        for (let i = 0; i < array.length; i++) {
            // console.log(array[i].item_name);
            let start = array[i].item_name.substr(0, itemNameLength);
            result += "<tr><td>" + start + /*spaceDelimiter.repeat(10 - start.substr(0, itemNameLength).length) +*/ "</td><td>" + typeDelimiter + array[i].item_category.substring(0, 1) + "</td><td>" + array[i].qty_sold + '</td><td align="right">' + (array[i].item_price * array[i].qty_sold).toFixed(2) + "</td><td>" + array[i].inv + "</td></tr>";
        }
        result += "</table>";
        // console.log(result)
        result += footer;

        return result;
    };

    runReport = async () => {
        // console.log("here", this.state.transactions);
        if (!this.state.transactions || this.state.transactions.length < 1)
            return;

        // get cashier at time of sale
        let user = await getUser(localStorage.getItem("token"));

        if (!user.user_id)
            throw new Error("Could not get user.\nTransaction not saved");

        let company = "AKORNO CATERING SERVICES" + "<br> ";
        // let vendor = 1;
        // let transaction_point = null;
        let cashier_name = (user.first_name + " " + user.last_name).substr(
            -company.length
        );
        let head = company + "Run By: " + lineDelimiter + cashier_name;
        let report_on = this.state.user_id === -1 ? "Everyone" : cashier_name;

        let foot = lineDelimiter + "Report On:" + report_on;
        //     columnDelimiter +
        //     columnDelimiter +
        //     columnDelimiter +
        //     columnDelimiter +
        //     this.props.mTotal.toFixed(2) +
        //     lineDelimiter +
        //     "Paid :" +
        //     columnDelimiter +
        //     columnDelimiter +
        //     columnDelimiter +
        //     columnDelimiter +
        //     this.state.amount.toFixed(2) +
        //     lineDelimiter +
        //     "Change:" +
        //     columnDelimiter +
        //     columnDelimiter +
        //     columnDelimiter +
        //     "<strong>" +
        //     this.state.change.toFixed(2) +
        //     "</strong>" +
        //     lineDelimiter +
        //     "050-248-0435";

        let content = this.convertArrayOfObjectsToPrint(
            head,
            this.state.transactions,
            foot
        );
        if (content == null) return;

        let pri = document.getElementById("contents_to_print").contentWindow;
        pri.document.open();
        pri.document.write(content);
        pri.document.close();

        // if (
        //     window.confirm(`Are you sure you want to print:
        // Total     :     ${this.props.mTotal.toFixed(2)}
        // Paying  :     ${this.state.amount.toFixed(2)}
        // Change:     ${this.state.change.toFixed(2)}`)
        // ) {
        //     let ids = [],
        //         qty = [];

        //     this.props.mData.forEach(item => {
        //         ids.push(item.id);
        //         qty.push(item.qty);
        // });
        // let ids = this.props.mData.map(item => item.id);

        // ------------------- save transaction // saves as GMT

        // this.saveTransactions(
        //     ids,
        //     qty,
        //     vendor,
        //     transaction_point,
        //     user.user_id
        // );

        // -----------------------------------------------

        pri.focus();
        pri.print();
    };

    render() {
        // const {classes, theme} = this.props;
        return (
            <>
                <PageTitle title="Reports"/>

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
                                            />
                                        </Grid>

                                        <Grid item xs={1}>

                                            <IconButton size="medium"
                                                        style={{
                                                            height: "100px",
                                                            width: "100px"
                                                        }}
                                                        onClick={this.runReport}
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
                                title="Report"
                                columns={columnsR}
                                data={this.state.transactions}
                                // selectableRows // add for checkbox selection
                                // selectableRowsComponent={Checkbox}
                                // selectableRowsComponentProps={{ inkDisabled: true }}
                                // onRowSelected={this.handleChange}
                                // defaultSortField={"item_name"}
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
                                // fixedHeaderScrollHeight='500px'
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
// export default withStyles(useStyles, {withTheme: true})(MyLoginPage);
export default useStyles(Reports);


