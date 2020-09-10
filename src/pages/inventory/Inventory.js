import React, { Component, Fragment } from "react";
import Img from "react-image";
import useStyles from "./styles";

import memoize from "memoize-one";
import {
    Checkbox, IconButton, FormControl, InputLabel,
    FormControlLabel, Select, MenuItem, TextField, Button, Grid,
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import {
    ArrowDownward,
    Save as SaveIcon,
    CloudUpload as CloudUploadIcon,
    Add,
    CheckCircleOutline,
    GpsFixed,
    RemoveCircleOutline,
    GpsOff,
    AttachMoney, Cached, DeleteForeverSharp,
} from "@material-ui/icons";
import GetItemCategoriesDropDown from "../_shared_components/GetItemCategoriesDropDown";
import moment from "moment";

import { fetcher, ITEM_UPDATE, ALL_ITEMS, ADD_STOCK, getUser, BULK_ITEM_UPDATE } from "../../_utils/fetcher";
import { Typography } from "../../components/Wrappers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../../components/Notification";
import { textFieldStyle } from "../../_utils/inlineStyles";
import Tooltip from "@material-ui/core/Tooltip";
import FilterComponent from "../_shared_components/FilterComponent";
import FormDialog from "../items/components/FormDialog";

const columnsR = [
    { name: "Name", selector: "name", sortable: true, grow: 4 },
    {
        name: "Price", selector: "price", right: false, sortable: true, hide: "sm", grow: 2,
        cell: (row) => (row.price).toFixed(2),
    },
    { name: "Category", selector: "category.name", sortable: true },
    {
        name: "In Stock", selector: "quantity", sortable: true, width: "70px",
        cell: (row) => {
            return row.quantity === null ? "-" : row.quantity;
        },
    },
    {
        name: "Picture", selector: "name", width: "50px", cell: (d) =>
          <Img width="40px" alt={d.pic}
               src={[`/images/${d.pic}.svg`,
                   `/images/${d.pic}.png`,
                   `/images/${d.pic}.gif`,
                   `/images/${d.pic}.jpg`,
                   `/images/${d.pic}.jpeg`,
               ]}/>,
    },
    {
        name: "Track Stock", selector: "has_stock", hide: "sm", sortable: true, width: "50px", cell: (da) => {
            return <Checkbox
              id="standard-secondary"
              label="Track Stock" color="secondary"
              checked={da.has_stock}/>;
        },
    },
    {
        name: "Min Stock", selector: "min_stock_level", sortable: true, width: "70px",
        cell: (row) => row.min_stock_level === null ? "-" : row.min_stock_level,
    },
    { name: "Status", selector: "status", sortable: true },
    {
        name: "Last Update",
        selector: "updatedAt",
        sortable: true,
        grow: 8,
        format: d => moment(parseInt(d.updatedAt)).format("dd-Do-MM-YY HH:mm"),
    },
    {
        name: "Created At",
        selector: "createdAt",
        sortable: true,
        grow: 8,
        cell: d => moment(parseInt(d.createdAt)).format("dd-Do-MM-YY HH:mm"),
    },
];
const contextActions = memoize((deleteHandler, disableHandler, enableHandler, stockEnabler, stockDisabler, priceHandler, minStockHandler) => (
  <span>
        <Tooltip title="Min Stock">
            <IconButton onClick={minStockHandler}>
                <Cached fontSize={"large"} style={{ fill: "#5D0A25" }}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Price">
            <IconButton onClick={priceHandler}>
                <AttachMoney fontSize={"large"} style={{ fill: "#85BB65" }}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Track">
            <IconButton onClick={stockEnabler} color={"default"}>
                <GpsFixed fontSize={"large"} style={{ fill: "#2196F3" }}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Cancel Track">
            <IconButton onClick={stockDisabler} color={"default"}>
                <GpsOff fontSize={"large"} />
            </IconButton>
        </Tooltip>
        <Tooltip title="Enable">
            <IconButton onClick={enableHandler} color={"default"}>
                <CheckCircleOutline fontSize={"large"} style={{ fill: "#4CAF50" }}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Disable">
            <IconButton onClick={disableHandler}>
                <RemoveCircleOutline fontSize={"large"} style={{ fill: "#FF9800" }}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
            <IconButton onClick={deleteHandler} aria-label="delete">
                <DeleteForeverSharp fontSize={"large"} style={{ fill: "red" }}/>
            </IconButton>
        </Tooltip>
    </span>
));

let arrowDownward = <ArrowDownward/>;

let classes = null;

let toastOptions = null;

class Inventory extends Component {
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
            filterText: "",
            sth_changed: false,
            stock_add_value: 0,
            filteredItems: [],
            open: false,
            selectedRows: [],
            toggleCleared: false,
        };
    };

    componentDidMount() {
        this.fetchItems();
    }

    toggleCleared = () => this.setState({ toggleCleared: !this.state.toggleCleared });

    actions = () => [
        <FilterComponent
          onFilter={e => this.setFilterText(e.target.value)}
          onClear={this.handleClear}
          filterText={this.state.filterText}
          key={1}
        />,
        <Tooltip title="Add New" key={2}>
            <IconButton color="secondary" onClick={this.handleClickOpen}>
                <Add fontSize={"large"} style={{ fill: "#4CAF50" }}/>
            </IconButton>
        </Tooltip>,
    ];

    // save new item
    handleClickOpen = () => this.setState({ open: true });

    handleClose = () => this.setState({ open: false });


    saveNewItem = async (e) => {

        let item = this.getItemStats(null, e);
        let item_id = await this.updateOrCreateItem(item); //actually create new item;

        if (item_id > -1) this.handleClose();
    };

    setFilterText = (text) => {
        this.setState({
            filterText: text,
            filteredItems: this.state.items.filter(item => item.name && item.name.toLowerCase().includes(text.toLowerCase())),
        });
    };

    handleClear = () => {
        this.setState({ filterText: "", filteredItems: this.state.items });
    };


//------------------------ // this will really slow down program ----------------------------------------
    handleChangeDropDown = (event, data) => {
        this.handleChange(event);

        let items = [...this.state.items];
        for (let i = 0; i < items.length; i++) {
            if (items[i] === data) {
                // items[i].category.id = event.key
                items[i].category.id = event.target.value;
                break;
            }
        }
        this.setState({ items, filteredItems: items });
    };
//----------------------------------------------------------------------------
    handleChange = () => { // not using  this
        this.setState({ sth_changed: true });
    };

    handleSelected = (type) => {
        // send all items to the backend with ID's and new method or update each one at a time
        let ids = [], names = [];

        this.state.selectedRows.forEach(item => {
            ids.push(item.id);
            names.push(item.name);
        });

        this.bulkUpdate(ids, names, type);
    };

    deleteSelected = data => console.log(data);


    SampleExpandedComponent = ({ data }) => {
        return <Fragment>
            <br/>
            <Grid container spacing={1} direction="row"
                  justify="space-evenly" alignItems="flex-start">
                <Grid item lg={6} md={7} xs={7}>

                    <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        this.saveItem(data, e);
                    }}>
                        <Grid container spacing={1} justify="space-around"
                              className={classes.dashedBorder}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                  InputProps={{
                                      style: textFieldStyle.resize,
                                  }}
                                  required label="Name" color="primary" fullWidth
                                  autoComplete="i_name" name='item_name'
                                  defaultValue={data.name} onChange={this.handleChange}/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                  id="standard-secondar" label="Price"
                                  inputProps={{ step: "0.50", min: "-10.00", style: textFieldStyle.resize }}
                                  color="primary" type='number'
                                  fullWidth autoComplete="i_price" required
                                  defaultValue={parseFloat(data.price).toFixed(2)} name='item_price'
                                  onChange={this.handleChange}/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <GetItemCategoriesDropDown
                                      category_id={data.category.id}
                                      changeHandler={(e) => {
                                          this.handleChangeDropDown(e, data);
                                      }}/>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <FormControlLabel
                                  control={<Checkbox
                                    id="standard-secondary"
                                    label="Track Stock" color="primary"
                                    name='has_stock' onChange={this.handleChange}
                                    defaultChecked={data.has_stock}/>}
                                  label="Track Stock"
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                  InputProps={{
                                      style: textFieldStyle.resize,
                                  }}
                                  fullWidth id="standard-second" label="Picture"
                                  color="primary" onChange={this.handleChange}
                                  defaultValue={data.pic} name='item_pic'/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <TextField
                                  id="standard-second" label="Min Stock"
                                  color="primary"
                                  inputProps={{ step: "1", min: "0", style: textFieldStyle.resize }}
                                  onChange={this.handleChange}
                                  defaultValue={data.min_stock_level} name='min_stock' type='number'/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <FormControl
                                  fullWidth
                                  style={{ margin: 0, style: textFieldStyle.resize }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select style={textFieldStyle.resize}
                                            id="standard-secondary" label="Status"
                                            color="primary" onChange={this.handleChange}
                                            defaultValue={data.status} name='status'>
                                        <MenuItem
                                          style={textFieldStyle.resize}
                                          value={"enabled"}>Enabled</MenuItem>
                                        <MenuItem style={textFieldStyle.resize}
                                                  value={"disabled"}>Disabled</MenuItem>
                                        <MenuItem style={textFieldStyle.resize}
                                                  value={"deleted"}>Deleted</MenuItem>
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
                    </form>
                </Grid>

                <Grid item lg={3} md={7} xs={7}>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        this.handleAddStock(data, e);
                    }}>

                        <Grid container spacing={1} justify="center"
                              className={classes.dashedBorder2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant={"h4"} color="secondary" className={classes.text}>
                                    STOCK
                                    <Checkbox id="standard-secondary" label="Track Stock"
                                              color="secondary" hidden
                                              name='has_stock' checked={data.has_stock}/>
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                  InputProps={{
                                      style: textFieldStyle.resize,
                                  }}
                                  fullWidth label="In Stock"
                                  color="secondary" type='number'
                                  value={data.quantity === null ? "" : data.quantity} name='qty_in_stock'
                                  variant="standard" disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth label="Quantity To Add" color="secondary"
                                  inputProps={{ step: "1", min: "0", style: textFieldStyle.resize }}
                                  variant="standard" type='number'
                                  defaultValue={this.state.stock_add_value}
                                  name='qty_to_add'
                                  disabled={false}/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button type='submit' fullWidth color='secondary'
                                        startIcon={<CloudUploadIcon/>}
                                        style={textFieldStyle.resize}
                                        variant="contained">Add Stock</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
            <br/>
        </Fragment>;
    };

    getItemStats = (data, e) => {
        let item = {};
        item.id = data !== null ? data.id : 0; // 0 : new item , else updating item
        item.name = e.target.item_name.value.charAt(0).toUpperCase() + e.target.item_name.value.trim().toLowerCase().substring(1);
        item.pic = e.target.item_pic.value.trim();
        item.price = parseFloat(e.target.item_price.value);
        item.category_id = parseInt(e.target.item_category.value);
        item.has_stock = e.target.has_stock.checked;
        item.status = e.target.status.value;
        item.min_stock_level = parseInt(e.target.min_stock.value);

        if (/*item.name === '' || */ item.name === null || item.name.length < 1) {
            alert("This item name can not be empty.");
            return;
        }

        if (item.price === null || item.price < -10) {
            alert("The item price can not less than 0.50.");
            return;
        }

        if (item.has_stock && item.min_stock_level < 1) {
            alert("This minimum stock cannot be less 1.");
            return;
        }

        return item;
    };

    saveItem = (data, e) => {
        if (!this.state.sth_changed) {
            console.log("NO changes");
            return;
        }

        let item = this.getItemStats(data, e);

        this.updateOrCreateItem(item, 1);
    };

    updateOrCreateItem = async (item, up) => {
        let updatedOrAdded = "failed";
        try {
            let res = await fetcher({
                query: ITEM_UPDATE,
                variables: { ...item, tp: parseInt(localStorage.getItem("tp")) },
            });

            if (res && res.errors) {
                console.log(...res.errors);
            }
            if (res && res.errors && res.errors.length < 2) {
                alert(res.errors[0].message);
                return;
            }

            if (up === 1) { // item updated
                updatedOrAdded = "updated";
                let items = [...this.state.items];

                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === item.id) {
                        items[i] = JSON.parse(JSON.stringify(items[i]));
                        items[i].pic = item.pic;
                        items[i].name = item.name;
                        items[i].price = item.price;
                        items[i].category.id = item.category_id;
                        items[i].has_stock = item.has_stock;
                        items[i].status = item.status;
                        items[i].min_stock_level = !(item.min_stock_level > -1) ? null : item.min_stock_level;
                        break;
                    }
                }
                this.setState({ items, filteredItems: items, sth_changed: false });
            } else {
                updatedOrAdded = "added";

                let newItem = res.data.updateItem;

                const items = [...this.state.items, newItem];

                this.setState({ items, filteredItems: items, sth_changed: false });
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
        return item.id;
    };

    bulkUpdate = async (ids, names, type) => {

        if (ids.length > 10 && !window.confirm(`Are you sure you want to update ${ids.length} items?`)) return;

        if (type === "price") {
            type = (prompt(`Price:\r ${this.state.selectedRows.map(r => r.name)}?`));
            if (isNaN(type)) {
                alert("Not a number");
                return;
            } else if (type === null) {
                return;
            }
            type = "price: " + type;
        } else if (type === "min_stock") {
            type = (prompt(`Minimum Stock Level:\r ${this.state.selectedRows.map(r => r.name)}?`));
            if (isNaN(type)) {
                alert("Not a number");
                return;
            } else if (type === null) {
                return;
            } else if (parseInt(type) > 1000) {
                alert("Minimum stock quantity too high");
                return;
            }
            type = "min_stock: " + type;
        }

        try {
            let res = await fetcher({
                query: BULK_ITEM_UPDATE,
                variables: { ids, type, tp: parseInt(localStorage.getItem("tp")) },
            });

            if (res && res.errors) {
                console.log(...res.errors);
            }
            if (res && res.errors && res.errors.length < 2) {
                alert(res.errors[0].message);
                return;
            }

            const updated = res.data.bulkUpdate;

            let itemsMap = new Map([...this.state.items].map(i => [i.id, i]));

            updated.forEach((item) => {
                if (itemsMap.has(item.id)) {
                    item = { // to fix layout for table column data
                        ...item,
                        // id: item.id,
                        name: item.name,
                        price: item.price,
                        pic: item.pic,
                        category: item.category,
                    };
                    itemsMap.set(item.id, item);
                }
            });

            const items = [...itemsMap.values()];

            this.toggleCleared();
            this.setState({ items, filteredItems: items, sth_changed: false });

            const updated_items = updated.reduce((prev, curr) => (prev ? prev.name : prev) + ", " + curr.name);

            const componentProps = {
                type: "shipped",
                message: `${updated.length < 2 ? updated[0].name : updated_items} ${type.toUpperCase()}.`,
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
    };

    fetchItems = async () => {
        try {
            let res = await fetcher({
                query: ALL_ITEMS,
            });
            let items = res.data.getAllItems;
            this.setState({ items, filteredItems: items });
        } catch (err) {
            console.log(err);
        }
    };

    handleRowSelectedChange = (data) => {
        console.log("handleRowSelectedChange", data);
    };

    handleAddStock = async ({ id }, e) => {

        let item = {};
        item.id = id;
        item.qty_to_add = parseInt(e.target.qty_to_add.value.trim());
        item.has_stock = e.target.has_stock.checked;

        if (!(item.has_stock)) {
            alert("This item stock is not being tracked. Select Track Stock and Hit SAVE to start tracking");
            return;
        }
        let user_id = (await getUser(localStorage.getItem("token"))).user_id;

        if (!(item.qty_to_add > 0 && user_id)) {

            const componentProps = {
                type: "shipped",
                message: "Quantity to add cannot be zero or less (login exxp).",
                variant: "contained",
                color: "info",
            };

            toast(<Notification
              {...componentProps}
              className={classes.notificationComponent}
            />, toastOptions);
            return;
        }

        if (!(
          window.confirm(`Are you sure you want add this stock?`)
        )) {
            return;
        }

        try {
            let res = await fetcher({
                query: ADD_STOCK,
                variables: { id: item.id, add_to_stock: item.qty_to_add, user_id },
            });

            if (res && res.errors) {
                alert(res.errors[0].message);
                return;
            }

            if (res) {

                let items = [...this.state.items];
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === item.id) {
                        items[i].quantity = res.data.updateStock[1];
                        break;
                    }
                }
                this.setState({ items, filteredItems: items, stock_add_value: 0 });
            }

            const componentProps = {
                type: "shipped",
                message: item.qty_to_add + " added",
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
    };

    handleRowSelected = (sel) =>
      this.setState({ selectedRows: sel.selectedRows });

    render() {
        return (
          <Fragment>
              <FormDialog open={this.state.open}
                          onClose={this.handleClose}
                          handleSave={this.handleSave}
                          saveNewItem={this.saveNewItem}/>

              <ToastContainer/>
              <DataTable
                actions={this.actions()}
                columns={columnsR}
                data={this.state.filteredItems}
                clearSelectedRows={this.state.toggleCleared}
                defaultSortField={"name"}
                expandableRows
                highlightOnHover
                pointerOnHover
                striped
                expandableRowsComponent={<this.SampleExpandedComponent/>}
                selectableRowsComponent={Checkbox}
                sortIcon={arrowDownward}
                dense
                fixedHeader
                fixedHeaderScrollHeight={"65vh"}
                expandOnRowClicked
                customStyles={cust}
                contextActions={contextActions(() => this.handleSelected("deleted"), () => this.handleSelected("disabled"), () => this.handleSelected("enabled"), () => this.handleSelected("tracking"), () => this.handleSelected("disable track"), () => this.handleSelected("price"), () => this.handleSelected("min_stock"))}
                onSelectedRowsChange={this.handleRowSelected}
              />
          </Fragment>
        );
    }
}

const cust = {
    cells: {
        style: {
            fontSize: "16px",
        },
    },
};

export default useStyles(Inventory);
