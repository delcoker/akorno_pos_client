import React, {Component} from "react";
import DataTable from "react-data-table-component";

import memoize from 'memoize-one';
import {Add, ArrowDownward, Close, Delete, HighlightOff, Remove} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

import {YourAwesomeComponent} from "./YourAwesomeComponent";
import {ToastContainer} from "react-toastify";

// import MaterialDatatable from "material-datatable"; // ES6
// const MaterialDatatable = require('material-datatable'); // ES5
// import Notification from "../../../components/Notification";

const cust = {
    cells: {
        style: {
            fontSize: '16px', // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
};

const columnsR = deleteOrAddOneMore => [
    {name: "Item", selector: "item", sortable: true, compact: true, grow: 5, cell: row => row.item},
    {
        name: "Price",
        selector: "price",
        // wrap: true,
        right: true,
        maxWidth: "100px"
    },
    // {name: "Typ", selector: "type", width: "55px"}, // max wi
    {
        name: "Qty", selector: "qty", center: true, compact: true, grow: 5,

        cell: (row) => {
            const addIcon = <IconButton size={"medium"} onClick={() => {
                deleteOrAddOneMore(row.id, 1);
            }}
                // onMouseDown={() => console.log("+ being pressed")}
            >
                <Add color="secondary"/>
            </IconButton>;

            const minusIcon = <IconButton size={"medium"} onClick={() => {
                // console.log(row);
                deleteOrAddOneMore(row.id, -1)
            }}
                // onMouseDown={() => console.log("- being pressed")}
            >
                <Remove color="primary"/>
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
        right: true,
        compact: true,
        maxWidth: "90px",
        cell: (row) => {
            // let a = e=>deleteItem(row.id);
            const closeIcon = <IconButton size={"medium"} onClick={() => (deleteOrAddOneMore(row))}
                // onKeyPress={() => console.log("- being pressed")}
            >
                <HighlightOff color="error"/>
            </IconButton>;

            return <table>
                <tbody>
                <tr>
                    {/*<td>{addIcon}</td>*/}
                    <td>{(row.qty * row.price).toFixed(2)}</td>
                    <td>{closeIcon}</td>
                </tr>
                </tbody>
            </table>;
        }
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

    deleteSelectedRow = (row, remove_1) => {
        // console.log('row', row);

        // console.log(row, remove_1);
        if (remove_1) this.props.del_handleDelete(row, null, remove_1);
        else
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
                    columns={columnsR(this.deleteSelectedRow)}
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
                    fixedHeaderScrollHeight={'55vh'}
                    paginationPerPage={10}
                    customStyles={cust}
                    // onRowDoubleClicked={this.deleteSelectedRow}
                />


                <YourAwesomeComponent

                    printey={this.props.printey}
                    totalNii={this.props.totalNii}
                    payingNii={this.props.payingNii}
                    changeNii={this.props.changeNii}
                    handlePayingChangeNii={this.props.handlePayingChangeNii}
                    handleNumberClick={this.props.handleNumberClick}
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
