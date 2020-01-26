import React, {Component} from "react";
import DataTable from "react-data-table-component";

import memoize from 'memoize-one';
import {Add, ArrowDownward, Delete, Remove} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

import {YourAwesomeComponent} from "../../../components/FAB/YourAwesomeComponent";
import {ToastContainer} from "react-toastify";

// import MaterialDatatable from "material-datatable"; // ES6
// const MaterialDatatable = require('material-datatable'); // ES5
// import Notification from "../../../components/Notification";

const cust = {
    cells: {
        style: {
            fontSize: '17px', // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
};

const columnsR = [
    {name: "Item", selector: "item", sortable: true, maxWidth:'120px'},
    {
        name: "Price",
        selector: "price",
        wrap: true,
        right: true,
        maxWidth: "80px"
    },
    {name: "Typ", selector: "type", width: "55px"}, // max wi
    {
        name: "Qty", selector: "qty", maxWidth: "70px", center: true, compact: true,

        cell: (row) => {

            const addIcon = <IconButton size={"medium"} onClick={console.log('here')} onKeyPress={()=>console.log("+ being pressed")}>
                <Add color="secondary"/>
            </IconButton>;

            const minusIcon = <IconButton size={"medium"} onKeyPress={()=>console.log("- being pressed")}>
                <Remove color="secondary"/>
            </IconButton>;

            return <table>
                <tbody>
                <tr>
                    <td>{addIcon}</td>
                    <td>{row.qty}</td>
                    <td>{minusIcon}</td>
                </tr>
                </tbody>
            </table>;
        }
    },
    {
        name: "SubT",
        selector: "subtotal",
        wrap: true,
        right: true,
        maxWidth: "90px"
    }
];

// const spaceDelimiter = "&nbsp;";
// const columnDelimiter = "&emsp;";
// const lineDelimiter = "<br>";
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

// let classes = null;

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr

class SaleList extends Component {
    constructor(props) {
        super(props);
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

    // handleClearRows = () => {
    //     this.setState({toggledClearRows: !this.state.toggledClearRows})
    // };

    handleRowClicked = row => {

        // this.props.del_handleDelete(row, null, 1); // if there's a one, delete one item

        console.log(`${row.item} was clicked!`);
    };

    deleteSelectedRows = () => {
        const {selectedRows} = this.state;
        this.props.del_handleDelete(null, selectedRows);

        this.setState(state => ({toggleCleared: !state.toggleCleared}));
    };

    deleteSelectedRow = (row) => {
        this.props.del_handleDelete([row.id], null);

        // console.log("oooooooooooooooooooomg");

        this.setState(state => ({toggleCleared: !state.toggleCleared}));
    };


    render() {
        const {toggleCleared} = this.state;
        // console.log(toggleCleared);
        return (
            <>
                <ToastContainer/>
                <iframe
                    title={"Print Cart"} id="contents_to_print"
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
                    // pagination
                    fixedHeader
                    paginationPerPage={10}
                    customStyles={cust}
                    onRowDoubleClicked={this.deleteSelectedRow}
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
