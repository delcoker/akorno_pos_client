import React, {Component} from "react";
import DataTable from "react-data-table-component";

import memoize from 'memoize-one';

// import MaterialDatatable from "material-datatable"; // ES6
// const MaterialDatatable = require('material-datatable'); // ES5

import {ArrowDownward, Delete} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

import {
    CHECK_FOR_ANY_ACTIVE_SHIFT,
    CHECK_USER_SESSION,
    convertArrayOfObjectsToPrint, fetcher,
    getUser, isAnyShiftActive, SAVE_TRANSACTIONS, START_SHIFT
} from "../../../_utils/fetcher";
import {YourAwesomeComponent} from "../../../components/FAB/YourAwesomeComponent";
import {toast, ToastContainer} from "react-toastify";
import Notification from "../../../components/Notification";

const cust = {
    cells: {
        style: {
            fontSize: '17px', // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
};

const columnsR = [
    {name: "Item", selector: "item", sortable: true},
    {
        name: "Price",
        selector: "price",
        wrap: true,
        left: true,
        width: "80px"
    },
    {name: "Type", selector: "type", wrap: true, width: "70px"},
    {name: "Qty", selector: "qty", wrap: true, width: "55px"},
    {
        name: "SubT",
        selector: "subtotal",
        wrap: true,
        right: true,
        width: "90px"
    }
];

// const spaceDelimiter = "&nbsp;";
const columnDelimiter = "&emsp;";
const lineDelimiter = "<br>";
// const typeDelimiter = "-";

const contextActions = memoize(deleteHandler => (
    <IconButton
        color="secondary"
        onClick={deleteHandler}
    >
        <Delete/>
    </IconButton>
));

let arrowDownward = <ArrowDownward/>;

let classes = null;

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr

class SaleList extends Component {
    constructor(props) {
        super(props);
        classes = this.props;
        // console.log(props);
        this.tot = this.props.mTotal;
        this.amount_paying = 0;
        this.change = this.props.mChange;


        this.state = {
            tot: this.props.mTotal,
            amount: this.amount_paying,
            change: this.change,
            toggledClearRows: false,
            selectedRows: [],
            toggleCleared: false,
            amount_paying: this.amount_paying

        };

        this.totalSList = this.props.mTotalSales;
        this.amountPayingSList = this.props.mAmountPayingSales;
        this.changeSList = this.props.mChangeSales;

        // console.log(this.totalSList)
    }

    handleChange = table => {
        let ch = this.state.amount - this.props.mTotal;
        this.change = ch;
        console.log('Selected Rows: ', table.selectedRows, ch);
        // You can use setState or dispatch with something like Redux so we can use the retrieved data
        this.setState({
            selectedRows: table.selectedRows,
            data: this.props.mData,
            change: ch
        });
    };

    handleClearRows = () => {
        this.setState({toggledClearRows: !this.state.toggledClearRows})
    };

    handleRowClicked = row => {
        console.log(`${row.item} was clicked!`);
    };

    deleteSelectedRows = async (sth, ids) => {
        const {selectedRows} = this.state;
        // console.log('selectedRows', ids, this.state);

        // const deleted_ids  = selectedRows.map( item => {return { deleted_ids: item.id, names : item.item}});
        const deleted_ids = ids !== undefined ? ids : selectedRows.map(item => item.id);
        // const deleted_ids =  selectedRows.map(item => item.id);

        await this.props.del_handleDelete(deleted_ids);

        let ch = this.state.amount - this.props.mTotal;

        this.setState(state => ({toggleCleared: !state.toggleCleared, change: ch}));

        // console.log(this.state);
        // console.log(state);
    };

    getTotal = () => {
        // this.setState({tot:this.props.mTotal});
        return this.props.mTotal.toFixed(2);
    };


    handleFocus = event => {
        // 'sc-jAaTju iqjvgK'
        event.target.select();
    };

    // use this to run multiple sessions
    checkUserSession = async (user_id) => {
        try {
            return await (await fetcher({
                query: CHECK_USER_SESSION,
                variables: {user_id: user_id}
            })).data.userShiftStarted;
        } catch (e) {
            console.log(e);
        }
    };


    startShift = async (user_id) => {
        try {
            return await (await fetcher({
                query: START_SHIFT,
                variables: {user_id: user_id}
            })).data.createShift;
        } catch (e) {
            console.log(e);
        }
    };

    printey = async () => {
        // get cashier at time of sale
        const user = await getUser(localStorage.getItem("token"));

        if (!user.user_id) {

            throw new Error("Could not get user.\nTransaction not saved");
        }

        //check if user has started a shift
        const session_started = await this.checkUserSession(user.user_id);
        // console.log(session_started);
        if (!session_started) {

            if (window.confirm("You haven't started a SHIFT so you cannot make this sale.\n" +
                "Would you like to start one now")) {

                let active_shift = await isAnyShiftActive();

                if (active_shift !== null) {
                    alert(`${active_shift.user.first_name} ${active_shift.user.last_name} is already on a shift`);
                    return;
                }
                //

                if (await this.startShift(user.user_id)) {

                    // alert a shift has started
                    alert("Shift Started");
                    //
                } else {
                    alert("Shift not started.\nYou CANNOT make a sale.");
                    return;
                }
            } else {
                alert("You did not start a shift.\nYou CANNOT make a sale.");
                return;
            }
        }
        //


        this.change = (this.state.amount_paying - this.props.mTotal);

        if (!this.props.mData || this.props.mData.length < 1 ||
            this.change < 0) {

            const notification = {
                display: "flex",
                alignItems: "center",
                background: "transparent",
                boxShadow: "none",
                overflow: "visible",
            };

            const progress = {
                visibility: "hidden",
            };

            const toastOptions = {
                className: notification,
                progressClassName: progress
            };

            const componentProps = {
                type: "shipped",
                message: 'Less than 0?',
                variant: "contained",
                color: "success",
            };

            // console.log('toastOptions', toastOptions);
            toast(<Notification
                {...componentProps}
                className={classes.notificationComponent}
            />, toastOptions);

            return;
        }


        let company = "AKORNO CATERING SERVICES <br>";
        let vendor = 1;
        let transaction_point = null;
        let cashier_name =
            "Cashier: " +
            (user.first_name + " " + user.last_name).substr(-company.length);
        let head = company + cashier_name;


        let foot =
            lineDelimiter +
            "Total:" +
            columnDelimiter +
            columnDelimiter +
            columnDelimiter +
            columnDelimiter +
            this.props.mTotal.toFixed(2) +
            lineDelimiter +
            "Paid :" +
            columnDelimiter +
            columnDelimiter +
            columnDelimiter +
            columnDelimiter +
            this.state.amount_paying.toFixed(2) +
            lineDelimiter +
            "Change:" +
            columnDelimiter +
            columnDelimiter +
            columnDelimiter +
            "<strong>" + this.change.toFixed(2) + "</strong>" +
            lineDelimiter +
            "050-248-0435";

        let content = convertArrayOfObjectsToPrint(
            head,
            this.props.mData,
            foot
        );
        if (content == null) return;

        let pri = document.getElementById("contents_to_print").contentWindow;
        pri.document.open();
        pri.document.write(content);
        pri.document.close();

        if (
            window.confirm(`Are you sure you want to print:
                Total     :     ${this.props.mTotal.toFixed(2)}
                Paying  :     ${this.state.amount_paying.toFixed(2)}
                Change:     ${this.change.toFixed(2)}`)
        ) {
            let ids = [],
                qty = [];

            this.props.mData.forEach(item => {
                ids.push(item.id);
                qty.push(item.qty);
            });
            // let ids = this.props.mData.map(item => item.id);

            // ------------------- save transaction // saves as GMT

            let res = await this.saveTransactions(
                ids,
                qty,
                vendor,
                transaction_point,
                user.user_id
            );

            // console.log(res);

            if (res === 0) {
                alert("One of the items will go below the quantity left");
                return;
            }

            // -----------------------------------------------

            pri.focus();
            pri.print();

            /////////////////////////////
            // NotificationManager.warning("Done", cashier_name);

            this.deleteSelectedRows(null, ids);
            this.setState({amount_paying: 0, change: 0});
        }
    };

    handlePayingParent = (change, amount_paying) => {
        // console.log(change,amount_paying);

        this.change = change;
        this.amount_paying = amount_paying;
        this.setState({amount_paying, change});

        // this.props.mChangeHandlerSales(change,amount_paying);

    };

    saveTransactions = async (ids, qty, vendor_id, transaction_point_id, user_id) => {
        // console.log('user_id', user_id);
        try {
            let res = await fetcher({
                query: SAVE_TRANSACTIONS,
                variables: {
                    total_amount: this.props.mTotal,
                    qtys: qty,
                    vendor_id,
                    transaction_point_id,
                    item_ids: ids,
                    user_id
                }
            });
            // console.log(res)

            return (res.data.saveTransaction);
        } catch (err) {
            console.log(err);
        }

    };

    render() {
        const {toggleCleared} = this.state;
        // console.log(toggleCleared);
        return (
            <>
                <ToastContainer/>
                <iframe title={"Print Cart"} id="contents_to_print"
                        style={{height: "0px", width: "0px", position: "absolute"}}/>

                <DataTable
                    title="Cart"
                    columns={columnsR}
                    data={this.props.mData}
                    selectableRows={true}// add for checkbox selection
                    onSelectedRowsChange={this.handleChange}
                    defaultSortField={"item"}
                    clearSelectedRows={toggleCleared}
                    expandableRows={false}
                    highlightOnHover
                    pointerOnHover
                    striped
                    selectableRowsComponent={Checkbox}
                    sortIcon={arrowDownward}
                    onRowClicked={this.handleRowClicked}
                    contextActions={contextActions(this.deleteSelectedRows)}
                    pagination
                    fixedHeader
                    paginationPerPage={30}
                    // fixedHeaderScrollHeight="500px"
                    // Clicked
                    customStyles={cust}
                />


                <YourAwesomeComponent
                    total={this.props.mTotalSales}
                    printey={this.printey}
                    handlePayingPar={this.handlePayingParent}
                    amt_paying={this.state.amount_paying}
                    // change={this.state.change}
                    // changeFromPar={this.props.mChangeHandlerSales}

                    slTotal={this.props.mTotalSales}
                    slAmtPaying={this.props.mAmountPayingSales}
                    slChange={this.props.mChangeSales}
                />

            </>
        );
    }
}

// const Example = () => {
//     const componentRef = useRef();
//     return (
//         <div>
//             <ReactToPrint
//                 trigger={() => <button>Print this out!</button>}
//                 content={() => componentRef.current}
//             />
//             <SaleList ref={componentRef}/>
//         </div>
//     );
// };

// SaleList('Material UI', module)
//     // .add('Override Default Components', () => <MaterialTable />);
export default SaleList;
