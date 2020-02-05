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
    ITEM_UPDATE,
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
    // {
    //     name: 'Price', selector: 'price', right: false, sortable: true, hide: 'sm', grow: 2,
    //     cell: (row) => (row.price).toFixed(2)
    // },
    // {name: 'Category', selector: 'category.name', sortable: true,},
    // {
    //     name: 'In Stock', selector: 'quantity', sortable: true, width: '70px',
    //     cell: (row) => row.quantity === null ? '-' : row.quantity
    // },
    // {
    //     name: 'Picture', selector: 'name', width: '50px', cell: (d) =>
    //         // <Avatar>
    //         <Img width="40px" alt={d.pic}
    //              src={[`/images/${d.pic}.svg`,
    //                  `/images/${d.pic}.png`,
    //                  `/images/${d.pic}.gif`,
    //                  `/images/${d.pic}.jpg`,
    //                  `/images/${d.pic}.jpeg`,
    //              ]}/>
    //     // < /Avatar>
    // },
    // {
    //     name: 'Track Stock', selector: 'has_stock', hide: 'sm', sortable: true, width: '50px', cell: (da) => {
    //         return <Checkbox
    //             id="standard-secondary"
    //             label="Has Stock" color="secondary"
    //             checked={da.has_stock}/>
    //     }
    // },
    // {
    //     name: 'Min Stock', selector: 'min_stock_level', sortable: true, width: '70px',
    //     cell: (row) => row.min_stock_level === null ? '-' : row.min_stock_level
    // },
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
        // format: d => moment(d.airstamp).format('LLL'),
        // format: d => moment(parseInt(d)).format("L")
        // format: d => (new Date((d))).toString()//.format("dd.mm.yyyy hh:MM:ss")
        // format: d => moment((d)).format("ll")//.format("dd.mm.yyyy hh:MM:ss")
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
            // type: toast.TYPE.SUCCESS,
            // variant: "contained",
            // color: "primary",
            className: classes.notification,
            progressClassName: classes.progress,
        };
        this.state = {
            items: [],
            itemCategories: [],
            filterText: '',
            sth_changed: false,
            stock_add_value: 0,
            // resetPaginationToggle: false,
            // setResetPaginationToggle: false,
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
        // console.log('open new item dialog');
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    saveNewItem = async (e) => {
        // console.log(e.target.item_name.value);

        let item = this.getItemStats(null, e);
        this.saveItem(item);
        // let item_id = await this.updateOrCreateItem(item); //actually create new item;
        // console.log(item_id);


        // if (item_id > -1) this.handleClose();
    };
    // save new item done

//------------------------ // this will really slow down program ----------------------------------------
    handleChangeDropDown = (event, data) => {
        this.handleChange(event);
        /* let items = {...this.state.items}; // this didn't work - > array did []

         for (let i = 0; i < Object.keys(items).length; i++) {

             if (items[i] == data) {
                 items[i].category.id = event.target.value
                 // itemz[i].category.name = event.target.innerHTML
                 // console.log('kkeeey', itemz[i].category.id)
                 break;
             }
         }*/

        // const {options, value} = event.target;
        // console.log(options[value].innerHTML);
        // const {options, selectedIndex} = event.target;
        // console.log(event.target);
        // console.log(event, data);

        let items = [...this.state.items];
        for (let i = 0; i < items.length; i++) {
            if (items[i] === data) {
                // items[i].category.id = event.key
                items[i].category.id = event.target.value;
                break;
            }
        }
        this.setState({items, filteredItems: items})
    };
//----------------------------------------------------------------------------
    handleChange = () => { // not using  this

        // const {name, value} = e.target;
        // console.log(name, value);
        // this.setState({[name]: value});
        this.setState({sth_changed: true});
        // console.log('sth_changed')

    };

    deleteSelected = data => console.log(data);

    getItemStats = (data, e) => {

        // console.log('data === null' ,data === null , data);

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

        // if (!this.state.sth_changed) {
        //     console.log('NO changes');
        //     return;
        // }

        try {
            let res = await fetcher({
                query: CATEGORY_ADD,
                variables: item
            });

            // console.log(res);

            if (res && res.errors && res.errors.length === 1) {
                alert(res.errors[0].message);
                return;
            }

            alert('category saved')

            // } else if (res && res.errors && res.errors.length > 1) {
            //     return;
            // }

            //---------------- not really needed ------------------// APA should help me on this
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

            // } else if (res && res.errors && res.errors.length > 1) {
            //     return;
            // }

            //---------------- not really needed ------------------// APA should help me on this
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
                        {/*{console.log(classes.textFieldStyle)}*/}
                        {/*{console.log(textFieldStyle.resize)}*/}

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
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </form>
                </Grid>

                {/*<Grid item xs={7}>*/}

                {/*    <form onSubmit={(e) => {*/}
                {/*        e.preventDefault();*/}
                {/*        this.handleAddStock(data, e);*/}
                {/*    }}>*/}

                {/*        /!*<Grid container spacing={3} direction="row"*!/*/}
                {/*        /!*      justify="center" alignItems="center">*!/*/}
                {/*        /!*    <Grid container item xs={12} spacing={2}>*!/*/}
                {/*        <Widget title={data.name} disableWidgetMenu>*/}
                {/*            <Grid container spacing={3} justify="center"*/}
                {/*                  className={classes.dashedBorder2}>*/}
                {/*                <Grid item xs={12} sm={3}>*/}
                {/*                    <Typography variant="h5" color="secondary" className={classes.text}>*/}
                {/*                        STOCK*/}
                {/*                        <Checkbox id="standard-secondary" label="Has Stock"*/}
                {/*                                  color="secondary" hidden*/}
                {/*                                  name='has_stock' checked={data.has_stock}/>*/}
                {/*                    </Typography>*/}
                {/*                </Grid>*/}
                {/*                <Grid item xs={12} sm={3}>*/}
                {/*                    <TextField fullWidth label="Quantity In Stock"*/}
                {/*                               color="secondary" type='number'*/}
                {/*                               value={data.quantity} name='qty_in_stock'*/}
                {/*                               variant="standard" disabled={true}/>*/}
                {/*                </Grid>*/}
                {/*                <Grid item xs={12} sm={3}>*/}
                {/*                    <TextField fullWidth label="Quantity To Add" color="secondary"*/}
                {/*                               inputProps={{step: "1", min: "0"}}*/}
                {/*                               variant="standard"*/}
                {/*                               type='number' defaultValue={this.state.stock_add_value}*/}
                {/*                               name='qty_to_add'*/}
                {/*                               disabled={false}/>*/}
                {/*                </Grid>*/}
                {/*                <Grid item xs={12} sm={3}>*/}
                {/*                    <Button type='submit' fullWidth color='secondary'*/}
                {/*                            startIcon={<CloudUploadIcon/>}*/}
                {/*                            variant="contained">Add Stock</Button>*/}
                {/*                </Grid>*/}
                {/*            </Grid>*/}
                {/*        </Widget>*/}
                {/*        /!*    </Grid>*!/*/}
                {/*        /!*</Grid>*!/*/}
                {/*    </form>*/}
                {/*</Grid>*/}

            </Grid>
            <br/>
        </>
    };


    updateOrCreateItem = async (item, up) => {
        // console.log(item)
        let updatedOrAdded = 'failed';
        try {
            let res = await fetcher({
                query: ITEM_UPDATE,
                variables: item
            });
            //---------------- not really needed ------------------// APA should help me on this

            // console.log(res);

            if (res && res.errors && res.errors.length === 1) {
                alert(res.errors[0].message);
                return;
            }
            // } else if (res && res.errors && res.errors.length > 1) {
            //     return;
            // }


            if (up === 1) { // item updated
                updatedOrAdded = 'updated';
                let items = [...this.state.items];

                // const newItemsState = this.state.items.map((i) => {
                //     if(i.id === item.id) {
                //         i = {
                //             ...item,
                //             category: {
                //                 id: item.category_id
                //             }
                //         };
                //     }
                //
                //     return i;
                // });

                // console.log(item);

                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === item.id) {
                        items[i] = JSON.parse(JSON.stringify(items[i]));
                        items[i].id = item.id;
                        items[i].pic = item.pic;
                        items[i].name = item.name;
                        items[i].price = item.price;
                        items[i].category.id = item.category_id;
                        items[i].has_stock = item.has_stock;
                        items[i].min_stock_level = !(item.min_stock_level > -1) ? null : item.min_stock_level;
                        items[i].status = item.status;
                        break;
                    }
                }

                this.setState({items, filteredItems: items, sth_changed: false})
            } else {
                updatedOrAdded = 'added';
                let items = [...this.state.items];
                for (let i = 0; i < items.length; i++) {
                    if (items[i].name === item.name) {
                        alert("An item with this name already exist");
                        item.id = -1; // and item already exist
                        return item.id;
                    }
                }

                const newItem = res.data.updateItem;
                // console.log(newItem);

                items = [...this.state.items, newItem];

                this.setState({items, filteredItems: items, sth_changed: false})
            }

            const componentProps = {
                type: "shipped",
                message: `${item.name} ${updatedOrAdded}.`,
                variant: "contained",
                color: "success",
            };

            toast(<Notification
                {...componentProps}
                className={classes.notificationComponent}
            />, toastOptions);

        } catch (err) {
            console.log(err);
        }
        // console.log(item.id);
        return item.id;
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
                    pagination
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
            fontSize: '16px', // override the cell padding for data cells
            // paddingRight: '8px',
        },
    },
};

// export default Items;
export default useStyles(ItemCategory);