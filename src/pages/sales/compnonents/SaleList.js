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
    fetcher,
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
            toggledClearRows: false,
            selectedRows: [],
            toggleCleared: false,
        };
    }

    handleChange = table => {
        // let ch = this.state.amount - this.props.mTotal;
        // this.change = ch;
        // console.log('Selected Rows: ', table.selectedRows);
        // You can use setState or dispatch with something like Redux so we can use the retrieved data
        this.setState({
            selectedRows: table.selectedRows,
            // data: this.props.mData
        });
    };

    handleClearRows = () => {
        this.setState({toggledClearRows: !this.state.toggledClearRows})
    };

    handleRowClicked = row => {
        console.log(`${row.item} was clicked!`);
    };

    deleteSelectedRows =  () => {
        const {selectedRows} = this.state;
        this.props.del_handleDelete(null, selectedRows);

        this.setState(state => ({toggleCleared: !state.toggleCleared}));
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

                    printey={this.props.printey}
                    totalNii={this.props.totalNii}
                    payingNii={this.props.payingNii}
                    changeNii={this.props.changeNii}
                    handlePayingChangeNii={this.props.handlePayingChangeNii}
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
