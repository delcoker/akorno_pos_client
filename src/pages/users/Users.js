import React, {Component, Fragment} from 'react';
import Img from 'react-image';
// import styled from 'styled-components';
import useStyles from './styles'

import memoize from 'memoize-one';
import {
    Checkbox, IconButton, FormControl, InputLabel,
    FormControlLabel,
    Select, MenuItem, TextField, Button, Grid,
} from "@material-ui/core";
import DataTable from "react-data-table-component";
import {
    Add, ArrowDownward, Delete, Close,
    Save as SaveIcon, Cancel as ResetIcon, GpsFixed, GpsOff, RemoveCircleOutline, DeleteForeverSharp, CheckCircleOutline
} from '@material-ui/icons';

import moment from "moment";

import {
    fetcher, ALL_USERS, CREATE_USER,
    USER_UPDATE, ADMIN_RESET_PASSWORD, BULK_USER_UPDATE
} from "../../_utils/fetcher";
// import PageTitle from "../../components/PageTitle";
// import {Typography} from "../../components/Wrappers";

import CustomizedSnackbars from "../../components/myNotification/DelNotifcation";

import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notification from "../../components/Notification";
import Widget from "../../components/Widget";
import {textFieldStyle} from "../../_utils/inlineStyles";
import AddUserFormDialog from "./compnonents/AddUserFormDialog";
import Tooltip from "@material-ui/core/Tooltip";
import FilterComponent from "../_shared_components/FilterComponent";

const columnsR = [
    {name: 'First Name', selector: 'first_name', sortable: true, grow: 3,},
    {name: 'Last Name', selector: 'last_name', sortable: true, grow: 3,},
    {
        name: 'Other Names', selector: 'other_names', sortable: true, grow: 1,
        cell: row => row.other_names ? row.other_names.charAt(0) + '.' : "-"
    },
    {
        name: 'Pic', selector: 'pic', right: false, sortable: true, grow: 2,
        cell: row =>
            <Img width="40px" alt={row.pic}
                 src={[`/images/users/${row.pic}.svg`,
                     `/images/users/${row.pic}.png`,
                     `/images/users/${row.pic}.gif`,
                     `/images/users/${row.pic}.jpg`,
                     `/images/users/${row.pic}.jpeg`,
                 ]}/>
    },
    {name: 'Email', selector: 'email.email', right: false, sortable: true, grow: 4},
    {
        name: 'Admin', selector: 'isAdmin', hide: 'sm', sortable: true, width: '50px', cell: (da) => {
            return <Checkbox id="standard-secondary"
                             label="Has Stock" color="secondary"
                             checked={da.isAdmin}/>
        }, grow: 2
    },
    // {name: 'Vendor Site', selector: 'vendor.website_url', sortable: true, },
    // {name: 'Vendor Address', selector: 'vendor.postal_address', sortable: true, },
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
    {name: 'Status', selector: 'status', sortable: true, grow: 2},
    {
        name: 'Last Update',
        selector: 'updatedAt',
        sortable: true,
        grow: 4,
        format: d => moment(parseInt(d.updatedAt)).format("lll"),
    },
    {
        name: 'Created At',
        selector: 'createdAt',
        sortable: true,
        grow: 4,
        format: d => moment(parseInt(d.createdAt)).format("lll"),
    },
    {name: 'Vendor', selector: 'vendor.name', sortable: true,},
];

const contextActions = memoize((deleteHandler, disableHandler, enableHandler, adminDisabler, adminEnabler) => (
    <span>
        <Tooltip title="Admin">
            <IconButton onClick={adminEnabler} color={'default'}>
                <GpsFixed fontSize={'large'} style={{fill: "#2196F3"}}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Non Admin">
            <IconButton onClick={adminDisabler} color={'default'}>
                <GpsOff fontSize={'large'} /*style={{fill: "#2196F3"}}*//>
            </IconButton>
        </Tooltip>
        <Tooltip title="Enable">
            <IconButton onClick={enableHandler} color={'default'}>
                <CheckCircleOutline fontSize={'large'} style={{fill: "#4CAF50"}}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Disable">
            <IconButton onClick={disableHandler}>
                <RemoveCircleOutline fontSize={'large'} style={{fill: "#FF9800"}}/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
            <IconButton onClick={deleteHandler} aria-label="delete">
                <DeleteForeverSharp fontSize={'large'} style={{fill: "red"}}/>
            </IconButton>
        </Tooltip>
    </span>
));


let arrowDownward = <ArrowDownward/>;

let classes = null;

let toastOptions = null;

class Users extends Component {
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
            filteredUsers: [],
            filterText: '',
            sth_changed: false,
            // resetPaginationToggle: false,
            // setResetPaginationToggle: false,
            open: false,
            snackbar: {},
            selectedRows: [],
            toggleCleared: false,
            tp: parseInt(localStorage.getItem('tp')),
        };
    };

    componentDidMount() {
        this.fetchUsers();
    }

    toggleCleared = () => this.setState({toggleCleared: !this.state.toggleCleared})

    actions = () => [
        <FilterComponent
            onFilter={e => this.setFilterText(e.target.value)}
            onClear={this.handleClear}
            filterText={this.state.filterText}
            key={1}
        />,
        <Tooltip title="Add New" key={2}>
            <IconButton color="secondary" onClick={this.handleClickOpen}>
                <Add fontSize={'large'} style={{fill: "#4CAF50"}}/>
            </IconButton>
        </Tooltip>
    ];

    // save new item
    handleClickOpen = () =>this.setState({open: true});

    handleClose = () => this.setState({open: false});

    saveNewUser = async (e) => {
        let userStats = this.getUserStats(null, e);
        let user = await this.createUser(userStats); //actually create new item;

        if (user && user.user_id > 0) {
            this.handleClose();
        }
    };

    createUser = async userP => {
        if (!userP) return;
        let user = null;
        try {

            // const user = userP;
            let res = await fetcher({
                query: CREATE_USER,
                variables: userP
            });
            // console.log(res);

            if (res && res.errors && res.errors.length === 1) {
                alert(res.errors[0].message);
                return;
            }
            user = res.data.createUser;
            // else if (res && res.errors && res.errors.length >1){
            //     return;
            // }
        } catch (e) {
            console.log(e);
        }
        let users = [...this.state.users, user];

        this.setState({users, filteredUsers: users, sth_changed: false})
        // }

        const componentProps = {
            type: "shipped",
            message: userP.first_name + ' - ' + userP.email + " added.",
            variant: "contained",
            color: "success",
        };

        toast(<Notification
            {...componentProps}
            className={classes.notificationComponent}
        />, toastOptions);

        return user;
    };

    // save new user done

    getUserStats = (data, e) => {
        // console.log('e.target.is_admin', e.target.is_admin.checked);
        let user = {};
        user.user_id = data !== null ? data.user_id : 0;
        user.first_name = e.target.first_name.value.charAt(0).toUpperCase() + e.target.first_name.value.trim().substring(1);
        user.last_name = e.target.last_name.value.charAt(0).toUpperCase() + e.target.last_name.value.trim().substring(1);
        user.other_names = e.target.other_names.value.charAt(0).toUpperCase() + e.target.other_names.value.trim().substring(1);
        user.email = e.target.email.value.trim();
        user.isAdmin = e.target.is_admin.checked;
        user.pic = e.target.picture.value.trim();
        user.telephone = (e.target.telephone.value);
        user.status = e.target.status.value;
        user.postal_address = (e.target.postal_address.value);
        user.vendor_id = 1;
        user.password = '123';

        if (user.first_name === null || user.first_name.length < 1 ||
            user.last_name === null || user.last_name.length < 1) {
            alert('First name or last name cannot be empty.');
            return;
        }

        if (user.email === null || user.email.length < 1) {
            alert('The email cannot be empty.');
            return;
        }

        if (user.telephone === null || user.telephone.length < 1) {
            alert('The telephone cannot be empty.');
            return;
        }
        return user;
    };

    setFilterText = (text) => {
        this.setState({
            filterText: text,
            filteredUsers: this.state.users.filter(user => (user.first_name && user.first_name.toLowerCase().includes(text.toLowerCase())) || (user.last_name && user.last_name.toLowerCase().includes(text.toLowerCase())) || (user.other_names && user.other_names.toLowerCase().includes(text.toLowerCase())))
        });
    };

    handleClear = () => {
        this.setState({filterText: '', filteredItems: this.state.users})
    };

    handleChange = () => { // not using  this

        // const {name, value} = e.target;
        // console.log(name, value);
        // this.setState({[name]: value});
        this.setState({sth_changed: true});
        // console.log('sth_changed')

    };

    resetPassword = async (data) => {
        try {
            let res = await fetcher({
                query: ADMIN_RESET_PASSWORD,
                variables: {user_id: data.user_id}
            });

            if (res && res.errors) {
                alert(res.errors[0].message);
                return;
            }

            let reset = res.data.resetPasswordAdmin;

            reset ? alert("Password has been reset") : alert("Password reset fail");

        } catch (err) {
            console.log(err);
        }

    };

    deleteSelected = data => console.log(data);

    SampleExpandedComponent = ({data}) => {
        // const {classes} = this.props;
        return <>
            <br/>
            <Grid container spacing={3} direction="row"
                  justify="center" alignItems="center">

                <Grid item xs={7}>

                    <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        this.updateOldUser(data, e); /*this.handleClose();*/
                    }}>
                        {/*{console.log(classes.textFieldStyle)}*/}
                        {/*{console.log(textFieldStyle.resize)}*/}

                        <Widget title={'User Details'} disableWidgetMenu>
                            <Grid container spacing={3} justify="space-around"
                                  className={classes.dashedBorder}>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        required label="First Name" color="primary" fullWidth
                                        autoComplete="i_name" name='first_name'
                                        defaultValue={data.first_name} onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Last Name"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="i_price" required
                                        defaultValue={(data.last_name)} name='last_name'
                                        onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        label="Other Names" color="primary" fullWidth
                                        autoComplete="i_name" name='other_names'
                                        defaultValue={data.other_names} onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            id="standard-secondary"
                                            label="Is Admin" color="primary"
                                            name='is_admin' onChange={this.handleChange}
                                            defaultChecked={data.isAdmin}/>}
                                        label="Is Admin"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="email" required
                                        value={(data.email.email)} name='email'
                                        // readOnly={true}
                                        onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Telephone" type={'tel'}
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="i_price" required
                                        defaultValue={(data.telephone)} name='telephone'
                                        onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Picture"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="i_price"
                                        defaultValue={(data.pic)} name='picture'
                                        onChange={this.handleChange}/>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Address" multiline={true}
                                        rows={2} rowsMax={4}
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="i_price"
                                        defaultValue={(data.postal_address)} name='postal_address'
                                        onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={2}>
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
                                    <Button fullWidth
                                            style={textFieldStyle.resize}
                                            color='secondary' variant="contained"
                                            onClick={() =>
                                                this.resetPassword(data)
                                            }
                                            startIcon={<ResetIcon/>}>
                                        Reset
                                    </Button>
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

                <Grid item xs={7}>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        // this.handleAddStock(data, e);
                    }}>

                        <Widget title={"Vendor Details"} disableWidgetMenu>
                            <Grid container spacing={3} justify="center"
                                  className={classes.dashedBorder2}>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        label="Vendor"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="i_price" required
                                        defaultValue={(data.vendor.name)} name='vendor_name'
                                        onChange={this.handleChange}/>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth label="Vendor Telephone" color="secondary"
                                        inputProps={{step: "1", min: "0", style: textFieldStyle.resize,}}
                                        variant="standard" type='tel'
                                        defaultValue={data.vendor.telephone}
                                        name='vendor_telephone'
                                        disabled={false}/>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        fullWidth label="Vendor Website" color="secondary"
                                        inputProps={{style: textFieldStyle.resize,}}
                                        variant="standard"
                                        defaultValue={data.vendor.website_url}
                                        name='vendor_telephone'
                                        disabled={false}/>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        fullWidth label="Email"
                                        color="secondary" type='email'
                                        value={data.vendor.email} name='vendor_email'
                                        variant="standard"/>
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <TextField
                                        fullWidth label="Vendor Address" color="secondary"
                                        inputProps={{style: textFieldStyle.resize,}}
                                        variant="standard" rows={2} rowsMax={4}
                                        defaultValue={data.vendor.postal_address}
                                        name='vendor_address' type='text' multiline
                                        disabled={false}/>
                                </Grid>
                            </Grid>
                        </Widget>
                    </form>
                </Grid>

            </Grid>
            <br/>
        </>
    };

    updateOldUser = (data, e) => {
        // console.log('data', data);
        const userStats = this.getUserStats(data, e);

        this.updateUser(userStats);
    };

    updateUser = async (userP) => {
        // console.log(userP);
        let message = userP ? userP.first_name + ' - ' + userP.email + " could not be updated." : ' updateUser could not be saved';
        let color = "warning";

        try {
            let res = await fetcher({
                query: USER_UPDATE,
                variables: userP
            });

            //---------------- not really needed ------------------// APA should help me on this
            // console.log(res);

            if (res && res.errors) {
                alert(res.errors[0].message);
                return;
            }

            if (res && res.data.updateUser[0]) {

                let users = [...this.state.users];

                // let users = [...this.state.users];

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

                for (let i = 0; i < users.length; i++) {
                    if (users[i].user_id === userP.user_id) {
                        users[i] = JSON.parse(JSON.stringify(users[i]));
                        users[i].user = {...users[i].user, ...userP};
                        users[i].status = userP.status;

                        message = userP.first_name + ' - ' + userP.email + " updated.";
                        color = 'success';

                        break;
                    }
                }
                this.setState({users, filteredUsers: users, sth_changed: false})
            }

            const componentProps = {
                type: "shipped",
                message: message,
                variant: "contained",
                color: color
            };

            toast(<Notification
                {...componentProps}
                className={classes.notificationComponent}
            />, toastOptions);
        } catch (err) {
            console.log(err);
        }
    };

    fetchUsers = async () => {
        try {
            let res = await fetcher({
                query: ALL_USERS,
            });
            let users = res.data.allUsersNoAdminDis;

            this.setState({users, filteredUsers: users});
        } catch (err) {
            console.log(err);
        }
    };

    handleRowSelectedChange = (data) => {
        console.log('handleRowSelectedChange', data)
    };

    handleRowSelected = (sel) => {
        // console.log(sel.selectedRows);
        this.setState({selectedRows: sel.selectedRows})
    };

    handleSelected = (type) => {
        // send all items to the backend with ID's and new method or update each one at a time
        let ids = [], names = [];

        this.state.selectedRows.forEach(user => {
            ids.push(user.user_id);
            names.push(user.first_name);
        });

        this.bulkUpdate(ids, names, type);
    }

    bulkUpdate = async (ids, names, type) => {

        try {
            let res = await fetcher({
                query: BULK_USER_UPDATE,
                variables: {ids, type, tp: parseInt(localStorage.getItem('tp'))}
            });
// /*
            //---------------- not really needed ------------------// APA should help me on this

            // console.log(res);
            if (res && res.errors) {
                console.log(...res.errors);
            }
            if (res && res.errors && res.errors.length < 2) {
                alert(res.errors[0].message);
                return;
            }

            const updated = res.data.bulkUpdateUser;
            // console.log(updated);

            let usersMap = new Map([...this.state.users].map(u => [u.user_id, u]));
            // console.log(usersMap);

            updated.forEach((user) => {
                if (usersMap.has(user.user.user_id)) {
                    usersMap.set(user.user.user_id, user);
                    // console.log(usersMap);
                }
            });

            const users = [...usersMap.values()];
            // console.log(users);

            this.toggleCleared();
            this.setState({users, filteredUsers: users, sth_changed: false});

            const updated_users = updated.reduce((prev, curr) => {
                return (prev.user ? prev.user.first_name : prev) + ', ' + curr.user.first_name;
            });

            // console.log(updated_users);

            const componentProps = {
                type: "shipped",
                message: `${updated.length < 2 ? updated[0].user.first_name : updated_users} ${type.toUpperCase()}.`,
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

    handleRowSelectedChange = (data) => {
        console.log('handleRowSelectedChange', data)
    };

    render() {
        return (
            <Fragment>
                {this.state.saving
                &&
                <CustomizedSnackbars severity={'success'} message={'worked'}/>
                }
                <AddUserFormDialog open={this.state.open}
                                   onClose={this.handleClose}
                                   handleSave={this.handleSave}
                                   saveNewUser={this.saveNewUser}/>
                <ToastContainer/>

                <DataTable
                    actions={this.actions()}
                    columns={columnsR}
                    data={this.state.filteredUsers}
                    selectableRows // add for checkbox selection
                    clearSelectedRows={this.state.toggleCleared}
                    // onRowSelected={this.handleRowSelectedChange}
                    defaultSortField={'user.first_name'}
                    expandableRows
                    highlightOnHover
                    pointerOnHover
                    striped
                    expandableRowsComponent={<this.SampleExpandedComponent/>}
                    selectableRowsComponent={Checkbox}
                    sortIcon={arrowDownward}
                    // onRowClicked={this.handleRowClicked}
                    dense
                    // expand
                    fixedHeader
                    // fixedHeaderScrollHeight={'65vh'}
                    expandOnRowClicked
                    customStyles={cust}
                    // subHeader
                    // subHeaderComponent={this.actions()}
                    // pagination
                    paginationPerPage={15}
                    paginationRowsPerPageOptions={[15, 30, 50, 100]}
                    contextActions={contextActions(() => this.handleSelected('deleted'), () => this.handleSelected('disabled'), () => this.handleSelected('enabled'), () => this.handleSelected('notadmin'), () => this.handleSelected('admin'))}
                    onSelectedRowsChange={this.handleRowSelected}
                />
                {/*</Grid>*/}
            </Fragment>
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
export default useStyles(Users);
