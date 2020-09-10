import React, {Component} from 'react';
// import Img from 'react-image';
// import styled from 'styled-components';
import useStyles from './styles'

import memoize from 'memoize-one';
import {
    Checkbox, IconButton, FormControl, InputLabel,
    Select, MenuItem, TextField, Button, Grid,
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import {
    Add, ArrowDownward, Close, Delete,
    Save as SaveIcon
} from '@material-ui/icons';
// import GetItemCategoriesDropDown from "../_shared_components/GetItemCategoriesDropDown";
import moment from "moment";

import {
    fetcher,
    // ITEM_UPDATE,
    // ALL_ITEMS,
    GET_CATEGORIES,
    CATEGORY_ADD,
    ITEM_CATEGORY_UPDATE,
} from "../../_utils/fetcher";
import {textFieldStyle} from "../../_utils/inlineStyles";

import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notification from "../../components/Notification";
import Widget from "../../components/Widget";
import FormDialog from "./compnonents/FormDialog";

const columnsR = [
    {name: 'Name', selector: 'name', sortable: true, grow: 4,},
    {name: 'Status', selector: 'status', sortable: true,},
    {
        name: 'Last Update',
        selector: 'updatedAt',
        sortable: true,
        grow: 4,
        format: d => moment(parseInt(d.updatedAt)).format("llll"),
    },
    {
        name: 'Created At',
        selector: 'createdAt',
        sortable: true,
        grow: 5,
        format: d => moment(parseInt(d.createdAt)).format("llll"),
    },
];

const contextActions = memoize((deleteHandler) => (
    <IconButton onClick={deleteHandler}>
        <Delete color="secondary"/>
    </IconButton>
));

let arrowDownward = <ArrowDownward/>;

let classes = null;

let toastOptions = null;

class ItemCategory extends Component {
    constructor(props) {
        super(props);
        classes = this.props.classes;
        toastOptions = {
            className: classes.notification,
            progressClassName: classes.progress,
        };
        this.state = {
            items: [],
            itemCategories: [],
            filterText: '',
            sth_changed: false,
            stock_add_value: 0,
            filteredItems: [],
            open: false
        };
        this.fetchItems();
    };

    actions = () => [
        this.subHeaderComponentMemo(1),
        <IconButton color="primary" key={2} onClick={this.handleClickOpen}>
            <Add/>
        </IconButton>
    ];

    setFilterText = (text) => {
        this.setState({
            filterText: text,
            filteredItems: this.state.items.filter(item => item.name && item.name.toLowerCase().includes(text.toLowerCase()))
        });
    };

    handleClear = () => {
        this.setState({filterText: '', filteredItems: this.state.items})
    };

    subHeaderComponentMemo = (key) => {
        return <this.FilterComponent onFilter={e => this.setFilterText(e.target.value)}
                                     onClear={this.handleClear}
                                     filterText={this.state.filterText} key={key}/>;
    };

    FilterComponent = ({filterText, onFilter, onClear}) => (<>
        <TextField id="search" type="text" variant="standard"
                   placeholder="Filter by Name" value={filterText}
                   onChange={onFilter} inputProps={{
            // className: classes.text,
            style: textFieldStyle.resize,
        }}
        />
        <IconButton color="secondary" onClick={onClear}>
            <Close/>
        </IconButton>
    </>);

    // save new item
    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    saveNewItem = async (e) => {
        let item = this.getItemStats(null, e);
        this.saveItem(item);
    };
    handleChange = () => {
        this.setState({sth_changed: true});
    };

    deleteSelected = data => console.log(data);

    getItemStats = (data, e) => {
        let item = {};
        item.id =  data.id === null ? 0 : data.id;
        item.name = e.target.category_name.value.charAt(0).toUpperCase() + e.target.category_name.value.trim().substring(1);
        item.status = e.target.status.value;

        if (item.name === null || item.name.length < 1) {
            alert('This category name can not be empty.');
            return;
        }
        return item;
    };

    saveItem = async (item, e) => {
        try {
            let res = await fetcher({
                query: CATEGORY_ADD,
                variables: item
            });

            if (res && res.errors && res.errors.length === 1) {
                alert(res.errors[0].message);
                return;
            }

            alert('category saved');

        } catch (e) {

        }
    };

    updateItem = async (data, e) => {

        const item = this.getItemStats(data, e);

        if (!this.state.sth_changed) {
            console.log('NO changes');
            return;
        }

        console.log(item);

        try {
            let res = await fetcher({
                query: ITEM_CATEGORY_UPDATE,
                variables: item
            });

            if (res && res.errors) {
                alert(res.errors[0].message);
                return;
            }

            alert('category updated');

        } catch (e) {

        }
    };


    SampleExpandedComponent = ({data}) => {
        // const {classes} = this.props;
        return <>
            <br/>
            <Grid container spacing={3} direction="row"
                  justify="center" alignItems="center">

                <Grid item xs={7}>

                    <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        this.updateItem(data, e); /*this.handleClose();*/
                    }}>
                        <Widget title={'Item Details'} disableWidgetMenu>
                            <Grid container spacing={3} justify="space-around"
                                  className={classes.dashedBorder}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        required label="Name" color="primary" fullWidth
                                        autoComplete="i_name" name='category_name'
                                        defaultValue={data.name} onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl
                                        fullWidth
                                        style={{margin: 0, style: textFieldStyle.resize,}}>
                                        <InputLabel>Status</InputLabel>
                                        <Select style={textFieldStyle.resize}
                                                id="standard-secondary" label="Status"
                                                color="primary" onChange={this.handleChange}
                                                defaultValue={data.status} name='status'>
                                            <MenuItem
                                                style={textFieldStyle.resize}
                                                value={'enabled'}>Enabled</MenuItem>
                                            <MenuItem style={textFieldStyle.resize}
                                                      value={'disabled'}>Disabled</MenuItem>
                                            <MenuItem style={textFieldStyle.resize}
                                                      value={'deleted'}>Deleted</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button fullWidth type='submit'
                                            style={textFieldStyle.resize}
                                            color='primary' variant="contained"
                                            startIcon={<SaveIcon/>}>Save</Button>
                                </Grid>
                            </Grid>
                        </Widget>
                    </form>
                </Grid>
            </Grid>
            <br/>
        </>
    };

    fetchItems = async () => {
        try {
            let res = await fetcher({
                query: GET_CATEGORIES,
            });
            let items = res.data.getItemCategories;
            this.setState({items, filteredItems: items});
        } catch (err) {
            console.log(err);
        }
    };

    handleRowSelectedChange = (data) => {
        console.log('handleRowSelectedChange', data)
    };

    render() {
        return (
            <>
                <FormDialog open={this.state.open} onClose={this.handleClose}
                            handleSave={this.handleSave}
                            saveNewItem={this.saveNewItem}/>

                <ToastContainer/>
                {/**/}
                {/*<Grid container spacing={1} >*/}
                {/*<PageTitle title="Items"/>*/}
                <DataTable
                    // style={{width: '100%'}}
                    // title="Item Category"
                    actions={this.actions()}
                    columns={columnsR}
                    data={this.state.filteredItems}
                    selectableRows // add for checkbox selection
                    // onRowSelected={this.handleRowSelectedChange}
                    defaultSortField={'item'}
                    highlightOnHover
                    pointerOnHover
                    striped
                    expandableRows
                    expandableRowsComponent={<this.SampleExpandedComponent/>}
                    selectableRowsComponent={Checkbox}
                    sortIcon={arrowDownward}
                    // onRowClicked={this.handleRowClicked}
                    contextActions={contextActions(this.deleteSelected)}
                    // pagination
                    dense
                    // expand
                    // fixedHeader
                    expandOnRowClicked
                    customStyles={cust}
                    // subHeader
                    // subHeaderComponent={this.actions()}
                    paginationPerPage={15}
                    paginationRowsPerPageOptions={[15, 30, 50, 100]}
                />
                {/*</Grid>*/}
            </>
        );
    }
}

const cust = {
    cells: {
        style: {
            fontSize: '16px',
        },
    },
};

// export default Items;
export default useStyles(ItemCategory);
