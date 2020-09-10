import React, {Component} from "react";
import DataTable from "react-data-table-component";

import memoize from 'memoize-one';
import {Add, ArrowDownward, Delete, HighlightOff, Remove} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

import {YourAwesomeComponent} from "./YourAwesomeComponent";
import {ToastContainer} from "react-toastify";

const cust = {
    cells: {
        style: {
            fontSize: '16px',
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
    {
        name: "Qty", selector: "qty", center: true, compact: true, grow: 5,

        cell: (row) => {
            const addIcon = <IconButton size={"medium"} onClick={() => {
                deleteOrAddOneMore(row.id, 1);
            }}            >
                <Add color="secondary"/>
            </IconButton>;

            const minusIcon = <IconButton size={"medium"} onClick={() => {
                deleteOrAddOneMore(row.id, -1)
            }}
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
            const closeIcon = <IconButton size={"medium"} onClick={() => (deleteOrAddOneMore(row))}            >
                <HighlightOff color="error"/>
            </IconButton>;

            return <table>
                <tbody>
                <tr>
                    <td>{(row.qty * row.price).toFixed(2)}</td>
                    <td>{closeIcon}</td>
                </tr>
                </tbody>
            </table>;
        }
    }
];

const contextActions = memoize(deleteHandler => (
    <IconButton
        color="secondary"
        onClick={deleteHandler}
    >
        <Delete/>
    </IconButton>
));

let arrowDownward = <ArrowDownward/>;

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
        this.setState({
            selectedRows: table.selectedRows,
        });
    };

    handleRowClicked = row => {
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

        this.setState(state => ({toggleCleared: !state.toggleCleared}));
    };


    render() {
        const {toggleCleared} = this.state;
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
                    fixedHeader
                    fixedHeaderScrollHeight={'55vh'}
                    paginationPerPage={10}
                    customStyles={cust}
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
export default SaleList;
