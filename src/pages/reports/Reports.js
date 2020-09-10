import React, { Component, Fragment } from "react";
import {
    Button,
    Grid,
    Tab,
    Tabs,
} from "@material-ui/core";

// components
import {
    fetcher, GET_COMPACT_MOMO_BREAKDOWN,
    GET_COMPACT_MP_BREAKDOWN, GET_DEEP_MOMO_BREAKDOWN,
    GET_MEAL_PLAN_BREAKDOWN,
    GET_REPORT,
    getUser,
} from "../../_utils/fetcher";
import DataTable from "react-data-table-component";
import { textFieldStyle } from "../../_utils/inlineStyles";
import useStyles from "./styles";
import moment from "moment";
import SelectionOptions from "../_shared_components/SelectionOptions";
import memoizeOne from "memoize-one";

let classes = null;

const columnsR = [
    { name: "Item", selector: "item_name", sortable: true },
    { name: "Type", selector: "item_category", sortable: true },
    { name: "Quantity Sold", selector: "qty_sold", sortable: true },
    {
        name: "Total",
        selector: "total",
        sortable: true,
        cell: row => {
            return `${(row.qty_sold * row.item_price).toFixed(2)}`;
        },
    },
    { name: "Left In Stock", selector: "inv", sortable: true },
];

const columnsMPCompact = memoizeOne((payment_method) => {
    return [
        {
            name: payment_method === "meal plan" ? "Student Name" : "Momo Name",
            selector: payment_method === "meal plan" ? "student_detail.name" : "momo_detail.name",
            sortable: true,
        },
        {
            name: "ID",
            selector: payment_method === "meal plan" ? "student_detail.student_id" : "momo_detail.momo_id",
            sortable: true,
        },
        { name: "Total", selector: "subtotal", cell: row => row.subtotal.toFixed(2) },
        {
            name: "Date",
            selector: "createdAt",
            sortable: true,
            format: d => moment(parseInt(d.createdAt)).format("dd-Do-MM-YY"),
        },
    ];
});

const columnsMPDeep = memoizeOne((payment_method) => [
    {
        name: payment_method === "meal plan" ? "Student Name" : "Momo Name",
        selector: payment_method === "meal plan" ? "student_detail.name" : "momo_detail.name",
        sortable: true,
    },
    {
        name: "ID",
        selector: payment_method === "meal plan" ? "student_detail.student_id" : "momo_detail.momo_id",
        sortable: true,
    },
    {
        name: "Item",
        selector: "item_name",
        sortable: true,
        cell: row => row.item_name,
    },
    { name: "Type", selector: "item_category", sortable: true },
    { name: "Quantity Sold", selector: "qty_sold", sortable: true },
    {
        name: "Total",
        selector: "total",
        sortable: true,
        cell: row => {
            return `${(row.qty_sold * row.item_price).toFixed(2)}`;
        },
    },
    {
        name: "Bought On",
        selector: "createdAt",
        sortable: true,
        cell: d => moment(parseInt(d.createdAt)).format("llll"),
    },
]);

const lineDelimiter = "<br>";
const typeDelimiter = "-";
const company_name = "AKORNO";

class Reports extends Component {
    constructor(props) {
        super(props);
        classes = this.props.classes;
        this.user = null;
        this.user_id = -1;
        this.state = {
            transactions: [],
            mpBreakdown: [],
            compactBreakdown: [],
            startDate: new Date().setHours(2, 0), // set as 2 am
            endDate: new Date(),
            user_id: -1,
            total: 0,
            payment_method: "cash",
            selected_user_name: null,
            activeTabId: 0,
        };
    }

    async componentDidMount() {
        let user = await getUser(localStorage.getItem("token"));
        this.setState({ user_id: user.user_id }, this.fetchTransactions);
    }

    handleStartDateChange = date => this.setState({ startDate: date }, (this.handleReloadChanges));

    handleEndDateChange = date => this.setState({ endDate: date }, (this.handleReloadChanges));

    handleReloadChanges = () => {
        this.fetchTransactions();
        return ([1, 2].includes(this.state.activeTabId) ? (this.fetchCompactMealTransactions(), this.fetchDetailedMealTransactions()) : "");

    };

    fetchTransactions = async () => {
        try {
            let res = await fetcher({
                query: GET_REPORT,
                variables: {
                    user_id: this.state.user_id,
                    startDate: new Date(this.state.startDate),
                    endDate: new Date(this.state.endDate),
                    // transactionPoint,
                    payment_method: this.state.payment_method,
                },
            });
            const transactions = res.data.getDailyReport;
            let total = 0;
            for (let ite of transactions) {
                total += ite.qty_sold * ite.item_price;
            }

            // sort alphabetically
            transactions.sort(this.compare);

            this.setState({
                transactions,
                total,
            });
        } catch (err) {
            console.log(err);
        }
    };

    fetchCompactMealTransactions = async () => {
        let query = null;
        if (this.state.payment_method === "meal plan") query = GET_COMPACT_MP_BREAKDOWN;
        else if (this.state.payment_method === "momo") query = GET_COMPACT_MOMO_BREAKDOWN;
        try {
            let res = await fetcher({
                query: query,
                variables: {
                    user_id: this.state.user_id,
                    startDate: new Date(this.state.startDate),
                    endDate: new Date(this.state.endDate),
                    // transactionPoint,
                    payment_method: this.state.payment_method,
                },
            });
            let compactBreakdown = [];
            let total = 0;
            let newState = null;

            if (this.state.payment_method === "meal plan") {
                compactBreakdown = res.data.mPSmallBreakdown;

                newState = compactBreakdown.map(userItem => {
                    userItem.subtotal = userItem.qty_sold * userItem.item_price;
                    userItem.student_id = userItem.student_detail.student_id;
                    userItem.student_name = userItem.student_detail.name;

                    return userItem;
                });
                compactBreakdown = newState.reduce((prev, next) => {
                    if (next.student_id in prev) {
                        prev[next.student_id].subtotal += next.subtotal;
                    } else {
                        prev[next.student_id] = next;
                    }
                    return prev;
                }, {});

            } else if (this.state.payment_method === "momo") {
                compactBreakdown = res.data.momoCompactBreakdown;

                newState = compactBreakdown.map(userItem => {
                    userItem.subtotal = userItem.qty_sold * userItem.item_price;
                    userItem.momo_id = userItem.momo_detail.momo_id;
                    userItem.momo_name = userItem.momo_detail.name;

                    return userItem;
                });
                compactBreakdown = newState.reduce((prev, next) => {
                    if (next.momo_id in prev) {
                        prev[next.momo_id].subtotal += next.subtotal;
                    } else {
                        prev[next.momo_id] = next;
                    }
                    return prev;
                }, {});
            }

            // source: https://stackoverflow.com/questions/50338082/group-by-and-sum-and-generate-a-object-for-each-array-javascript
            compactBreakdown = Object.values(compactBreakdown);

            for (let ite of compactBreakdown) {
                total += ite.subtotal;
            }

            this.setState({
                compactBreakdown,
                total,
            });
        } catch (err) {
            console.log(err);
        }
    };

    fetchDetailedMealTransactions = async () => {

        let query = null;
        if (this.state.payment_method === "meal plan") query = GET_MEAL_PLAN_BREAKDOWN;
        else if (this.state.payment_method === "momo") {
            query = GET_DEEP_MOMO_BREAKDOWN;
        }

        try {
            let res = await fetcher({
                query: query,
                variables: {
                    user_id: this.state.user_id,
                    startDate: new Date(this.state.startDate),
                    endDate: new Date(this.state.endDate),
                    // transactionPoint,
                    payment_method: this.state.payment_method,
                },
            });

            let mpBreakdown = [];

            if (this.state.payment_method === "meal plan") {
                mpBreakdown = res.data.mealPlanBreakdown;
            } else if (this.state.payment_method === "momo") {
                mpBreakdown = res.data.momoDeepBreakdown;
            }

            let total = 0;
            for (let ite of mpBreakdown) {
                total += ite.qty_sold * ite.item_price;
            }
            this.setState({ mpBreakdown, total });
        } catch (err) {
            console.log(err);
        }
    };

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    convertArrayOfObjectsToCSV = () => {
        // console.log(array.target.value);
        let result;

        const columnDelimiter = ",";
        const lineDelimiter = "\n";
        const mpCompact = this.state.compactBreakdown;
        const mpDeep = this.state.mpBreakdown;
        result = "";
        if (this.state.activeTabId === 1) {
            if (mpCompact.length < 1) return;
            result += ["Name", "ID", "Subtotal", "Date"].join(columnDelimiter);
            result += lineDelimiter;

            for (let i = 0; i < mpCompact.length; i++) {
                let name = mpCompact[i].student_detail.name;
                let id = mpCompact[i].student_detail.student_id;
                let tot = mpCompact[i].qty_sold * mpCompact[i].item_price;
                let date = moment(parseInt(mpDeep[i].createdAt)).format("lll");
                result +=
                  name +
                  columnDelimiter +
                  id +
                  columnDelimiter +
                  tot +
                  columnDelimiter +
                  date +
                  lineDelimiter;
            }
        } else if (this.state.activeTabId === 2) {
            if (mpDeep.length < 1) return;
            result += [
                "Name",
                "ID",
                "Item",
                "Qty Purchased",
                "Subtotal",
                "Date",
            ].join(columnDelimiter);
            result += lineDelimiter;

            for (let i = 0; i < mpDeep.length; i++) {
                let name = mpDeep[i].student_detail.name;
                let id = mpDeep[i].student_detail.student_id;
                let item = mpDeep[i].item_name;
                let qty = mpDeep[i].qty_sold;
                let tot = mpDeep[i].qty_sold * mpDeep[i].item_price;
                let date = moment(parseInt(mpDeep[i].createdAt)).format("lll");
                result +=
                  name +
                  columnDelimiter +
                  id +
                  columnDelimiter +
                  item +
                  columnDelimiter +
                  qty +
                  columnDelimiter +
                  tot +
                  columnDelimiter +
                  date +
                  lineDelimiter;
            }
        }

        return result;
    };

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    exportToCSV = array => {
        const link = document.createElement("a");
        let csv = this.convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = "export.csv";

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute("href", encodeURI(csv));
        link.setAttribute("download", filename);
        link.click();
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

        this.setState({
              user_id: e.target.value,
              selected_user_name: e.nativeEvent.toElement.textContent,
          },
          this.handleReloadChanges);
    };

    convertArrayOfObjectsToPrint = (header, array, footer) => {
        const itemNameLength = 15;

        let result = header + lineDelimiter + lineDelimiter;
        result += `<table style="font-size: 16px; border-collapse: collapse; border:1px solid"><tr style="border:1px solid"><th align="left">Item</th><th>Ty</th><th>Qty</th><th>Total</th><th>Inv</th></tr>`;

        // let total_sales = 0;

        for (let i = 0; i < array.length; i++) {
            let subtotal = (array[i].item_price * array[i].qty_sold).toFixed(2);
            let start = array[i].item_name.substr(0, itemNameLength);
            result += `<tr><td style="border:1px solid; max-width: 80px">${start}</td>
                 <td style="border:1px solid">${typeDelimiter}${array[
              i
              ].item_category.substring(0, 1)}</td>
                <td style="border:1px solid">${array[i].qty_sold}</td>
                <td align="right" style="border:1px solid">${subtotal}</td>
                <td style="border:1px solid">${
              array[i].inv ? array[i].inv : "-"
            } </td>
                </tr>`;
        }
        result += `<tr style="border:1px solid"><td></td><td></td>
                    <td></td><td></td><td></td></tr><tr>
                    <td><strong>Total:</strong></td><td></td><td>
                    </td><td style="border:1px solid"><strong>${this.state.total.toFixed(
          2,
        )}</strong></td><td></td></tr></table>`;
        // console.log(result)
        result += footer;

        return result;
    };

    runReport = async () => {
        if (!this.state.transactions || this.state.transactions.length < 1) return;

        // get cashier at time of sale
        let user = await getUser(localStorage.getItem("token"));

        if (!user.user_id)
            throw new Error("Could not get user.\nTransaction not saved");

        let company = company_name + lineDelimiter;
        let report_runner = user.first_name + " " + user.last_name;

        let report_on = this.state.selected_user_name
          ? this.state.selected_user_name
          : localStorage.getItem("username");
        let head =
          company +
          "Run By: " +
          report_runner +
          lineDelimiter +
          "Report On: " +
          report_on;
        head +=
          lineDelimiter + "Start: " + moment(this.state.startDate).format("llll");
        head +=
          lineDelimiter + "End  : " + moment(this.state.endDate).format("llll");
        head += lineDelimiter + this.state.payment_method.toUpperCase();

        let foot = ""; // lineDelimiter + "Report On:" + report_on;
        foot += lineDelimiter + moment(new Date()).format("llll");

        let content = this.convertArrayOfObjectsToPrint(
          head,
          this.state.transactions,
          foot,
        );
        if (content == null) return;

        let pri = document.getElementById("contents_to_print").contentWindow;
        pri.document.open();
        pri.document.write(content);
        pri.document.close();

        pri.focus();
        pri.print();
    };

    handlePaymentMethodChange = e => {
        this.setActiveTabId(0);
        this.setState({
            payment_method: e.target.value,
            compactBreakdown: [],
            mpBreakdown: [],
        }, this.handleReloadChanges);
    };

    setActiveTabId = id => this.setState({ activeTabId: id }, this.handleReloadChanges);

    actions = () => [
        <Button
          key={0}
          onClick={this.exportToCSV}
          style={textFieldStyle.resize}
          color="primary"
          variant="contained"
        >
            Export To Excel
        </Button>,
    ];

    render() {
        return (
          <Fragment>
              <Grid container spacing={1} className={classes.iconsContainer}>
                  <Grid item xs={12}>
                      <SelectionOptions
                        handlePaymentMethodChange={this.handlePaymentMethodChange}
                        user_id={this.state.user_id}
                        handleDropDownChange={this.handleDropDownChange} // user
                        startDate={this.state.startDate}
                        handleStartDateChange={this.handleStartDateChange}
                        endDate={this.state.endDate}
                        handleEndDateChange={this.handleEndDateChange}
                        runReport={this.runReport}
                      />
                  </Grid>
                  <Tabs
                    indicatorColor="secondary"
                    textColor="secondary"
                    value={this.state.activeTabId}
                    onChange={(e, id) => {
                        this.setActiveTabId(id);
                    }}
                    className={classes.iconsBar}>

                      <Tab label={`${this.state.payment_method} Daily Report`} classes={{ root: classes.tab }}/>
                      {(this.state.payment_method === "meal plan" || this.state.payment_method === "momo") &&
                      <Tab label={`${this.state.payment_method} Breakdown`} classes={{ root: classes.tab }}/>}
                      {(this.state.payment_method === "meal plan" || this.state.payment_method === "momo") &&
                      <Tab label={`${this.state.payment_method} Deep Breakdown`} classes={{ root: classes.tab }}/>}
                  </Tabs>
                  {this.state.activeTabId === 0 && (
                    <Grid item xs={12}>
                        <DataTable
                          title={"Total: GH₵ " + this.state.total.toFixed(2)}
                          columns={columnsR}
                          data={this.state.transactions}
                          expandableRows={false}
                          highlightOnHover
                          pointerOnHover
                          striped
                          customStyles={dataTableFont}
                          fixedHeader
                          fixedHeaderScrollHeight="53vh"
                        />
                    </Grid>
                  )}
                  {this.state.activeTabId === 1 && (
                    <Grid item xs={12}>
                        <DataTable
                          title={"Total: GH₵ " + this.state.total.toFixed(2)}
                          actions={this.actions()}
                          columns={columnsMPCompact(this.state.payment_method)}
                          data={this.state.compactBreakdown}
                          expandableRows={false}
                          highlightOnHover
                          pointerOnHover
                          striped
                          customStyles={dataTableFont}
                          fixedHeader
                          fixedHeaderScrollHeight="53vh"
                        />
                    </Grid>
                  )}
                  {this.state.activeTabId === 2 && (
                    <Grid item xs={12}>
                        <DataTable
                          title={"Total: GH₵ " + this.state.total.toFixed(2)}
                          actions={this.actions()}
                          columns={columnsMPDeep(this.state.payment_method)}
                          data={this.state.mpBreakdown}
                          expandableRows={false}
                          highlightOnHover
                          pointerOnHover
                          striped
                          customStyles={dataTableFont}
                          fixedHeader
                          fixedHeaderScrollHeight="53vh"
                        />
                    </Grid>
                  )}
              </Grid>

              <iframe
                title={"Print Report"}
                id="contents_to_print"
                style={{ height: "0px", width: "0px", position: "absolute" }}
              />
          </Fragment>
        );
    }
}

const dataTableFont = {
    cells: {
        style: {
            fontSize: "17px", // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
};
export default useStyles(Reports);
