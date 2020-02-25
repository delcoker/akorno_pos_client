import React, {Component} from "react";
import {
    FormControl,
    Grid, InputLabel, MenuItem, Select,
} from "@material-ui/core";

// styles
// import useStyles from "./styles";
// import {withStyles} from "@material-ui/core/styles"

// import "../../del_css.css";

import Img from 'react-image';

import logo from '../../images/google.svg';
// components
import Widget from "../../components/Widget";
// import PageTitle from "../../components/PageTitle";
import {Typography} from "../../components/Wrappers";
import $ from 'jquery' // const $ = require('jquery'); // commonJS

import {
    CHECK_USER_SESSION,
    convertArrayOfObjectsToPrint,
    ENABLED_ITEMS,
    fetcher, GET_STUDENT_DETAIL,
    getUser,
    isAnyShiftActive, SAVE_TRANSACTIONS, START_SHIFT
} from "../../_utils/fetcher";

import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SaleList from "./compnonents/SaleList";
// import {YourAwesomeComponent} from "../../components/FAB/YourAwesomeComponent";
import {toast} from "react-toastify";
import Notification from "../../components/Notification";
import moment from "moment";
import {textFieldStyle} from "../../_utils/inlineStyles";

const useStyles = (theme => ({
    dashedBorder: {
        border: "1px dashed",
        borderColor: theme.palette.primary.main,
        padding: theme.spacing(2),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        marginTop: theme.spacing(1),
    },
    text: {
        marginBottom: theme.spacing(2),
    },
    notification: {
        display: "flex",
        alignItems: "center",
        background: "transparent",
        boxShadow: "none",
        overflow: "visible",
    },
    progress: {
        visibility: "hidden",
    },
}));

let classes = null;
let toastOptions = null;
// var classes = useStyles();
// var theme = useTheme();


const company_name = "AKORNO SERVICES LTD.";

// let API_KEY = "AIzaSyDXAm8fyR9alMVpg_Gq0-JfO6Yw_Kq7wQg";
// let ENGINE_ID = "012568330619765078995:hgynjoenxeu";

class Sales extends Component {
    constructor(props) {
        super(props);
        classes = this.props.classes;
        toastOptions = {
            className: classes.notification,
            progressClassName: classes.progress,
        };
        this.state = {
            items_list: new Map(),
            totalNii: 0,
            payingNii: 0,
            changeNii: 0,
            dataSet: [],
            quantity_clicked: '',
            payment_method: 'cash',
            payment_detail: '',
            student_details: {name: ''},
            student_number_txt: "",
        };
        // this.myRef = React.createRef();
    }

    componentDidMount() {
        this.fetchItems();
        this.addFindAnythingFilter();
    }

    addFindAnythingFilter() {
        $("#myInput").on("keyup", function () {
            const value = $(this).val().toLowerCase();
            // console.log(value); // actually don't need #myContainer
            $("#myContainer .filterable").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
                return '';
            });
        });
    };

    handleNumberClicked = (e, num) => {
        // console.log('num', num, 'num');
        let numm = num === '' ? 0 : this.state.quantity_clicked + num;

        this.setState({quantity_clicked: numm});
    };

    fetchItems = async () => {
        try {
            let res = await fetcher({
                query: ENABLED_ITEMS,
            });
            let items = res.data.getEnabledItems;
            this.setState({items});
            // return items;
        } catch (err) {
            console.log(err);
        }
    };

    del_handleDel = (ids, selectedRows, qty_to_del) => {

        // console.log('qty_to_del', qty_to_del);
        if (qty_to_del) {
            // console.log(ids, qty_to_del);
            this.removeOrAddOne(ids, qty_to_del); // id will be the actual row id
            return;
        }

        const deleted_ids = ids ? ids : selectedRows.map(item => item.id);
        let temp = this.handleItemDelete2(deleted_ids);
        this.getClickedItemsAsArray(temp);
    };

    removeOrAddOne = (row_id, qty) => {
        const map = new Map(this.state.items_list);
        let removingFrom = null;

        // console.log('row_id, qty', row_id, qty);

        for (let [k, v] of map) {
            if (k.id === row_id) { // means it's contained in list

                // check stock amount
                if (k.has_stock) {
                    if (v + qty > k.quantity) {
                        alert(`Cannot sell more than ${v} for ${k.name}`);
                        return;
                    }
                }

                qty += v;
                // console.log('qty_to_delete', k,v,qty);
                removingFrom = k;
                map.delete(k);
                break;
            }
        }


        if (qty > 0) {
            map.set(removingFrom, qty);
        }

        // console.log(map);

        this.getClickedItemsAsArray(map);

        this.setState({
            items_list: map,
            // dataSet: dat
        });
    };

    handleItemDelete2 = (indices) => {
        // console.log('map', indices);
        const map = this.state.items_list;

        map.forEach((value, keyObj) => {
            // console.log("keyObj", keyObj)
            indices.forEach((valu) => {
                // console.log("valu", valu)
                if (keyObj.id === valu) {
                    map.delete(keyObj);
                }
            });
        });

        this.setState({items_list: map});
        return map;
    };

    // when a card is clicked
    handleCardClickChild = (dataFromChild, qty) => {

        // console.log(dataFromChild);

        // console.log(parseInt(this.state.quantity_clicked));

        const map = new Map(this.state.items_list);

        if (map.size > 0) { // if there is a list
            for (let [k, v] of map) {
                if (k.id === dataFromChild.id) { // means it's contained in list
                    parseInt(this.state.quantity_clicked) > 0 ? qty = parseInt(this.state.quantity_clicked) : qty += v; // if number pad was used, get that value as qty
                    map.delete(k);
                    break;
                } else {
                    parseInt(this.state.quantity_clicked) > 0 ? qty = parseInt(this.state.quantity_clicked) : qty = 1;
                    // map.delete(k);
                }
            }
        } else {
            parseInt(this.state.quantity_clicked) > 0 ? qty = parseInt(this.state.quantity_clicked) : qty = 1;
            // map.delete(k);
        }

        if ((dataFromChild.has_stock && qty > dataFromChild.quantity)) {
            const componentProps = {
                type: "report",
                message: 'You will run out of stock for ' + dataFromChild.name,
                variant: "contained",
                color: "secondary",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);

            this.setState({quantity_clicked: ''});
            return;
        }

        if (qty > 500 && !(window.confirm(`Quantity ${qty} is greater than 500. Continue?`))) {
            this.setState({quantity_clicked: ''});
            return;
        }

        map.set(dataFromChild, qty);


        // console.log(dataFromChild, qty);

        this.getClickedItemsAsArray(map);

        this.setState({
            items_list: map,
            quantity_clicked: ''
        });

    };

    getClickedItemsAsArray = (mp) => {

        let mDataSet = [];
        let tot = 0;
        mp.forEach((value, key) => {
            if (key.name) {
                mDataSet.push({
                    pic: key.pic,
                    item: key.name,
                    price: key.price.toFixed(2),
                    type: key.category.name,
                    qty: value,
                    subtotal: (value * key.price).toFixed(2),
                    id: key.id
                });
            }
            tot += value * key.price;

        });
        // console.log(mDataSet);
        this.setState({
            totalNii: tot,
            changeNii: this.state.payingNii - tot,
            payingNii: tot,
            dataSet: mDataSet
        });
        // return mDataSet;
    };

    highlight = e => {
        e.target.select();
    };

    getItemImage = item_name => {
        /*  let API_URL = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?'
          let API_URL1 = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${ENGINE_ID}&searchType=image&q=${item_name}`
          let image_src = logo;
           $.getJSON(API_URL, {
                  tags: item_name,
                  tagmode: "any",
                  format: "json"
              },
               function (data) {
                  let rnd = Math.floor(Math.random() * data.items.length);
                  try {
                      let image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
                  }
                  catch (e) {
                      console.log(e);
                  }
                  // image_src = data.items[rnd]['link']; // for google
                  console.log(image_src)
              })//.then();
  */
        // console.log(`../../images/${item_name}`);
        return `images/${item_name}`;
    };

    handlePayingChangeNii = (paying) => {
        const change = (paying - this.state.totalNii);

        this.setState({
            payingNii: paying,
            changeNii: change
        });
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

    handlePaymentMethodChange = (e) => {
        const {value} = e.target;
        this.setState({payment_method: value});
        if (this.myRef.value > 6) {
            this.myRef.value = this.myRef.value.substring(0, 6);
            // this.student_name_ref.value = '';
        }
    };

    handleStudentNumber = async e => {
        if (this.state.payment_method === "cash" || this.state.payment_method === "visa") {
            this.myRef.value = "";
            const componentProps = {
                type: "defence",
                message: 'Choose meal plan first.',
                variant: "contained",
                color: "info",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);
            return;
        }
        const student_id = e.target.value;
        if (student_id.length < 7) return;
        // try to get student details
        try {
            let res = await fetcher({
                query: GET_STUDENT_DETAIL,
                variables: {
                    student_id,
                }
            });

            const student_details = res.data.getStudentDetail;
            // console.log(student_details);
            // this.student_name_ref.value = student_details.name;

            this.setState({student_details});

        } catch (err) {
            console.log(err);
        }
    };

    handleStudentName = async e => {
        if (this.state.payment_method === "cash" || this.state.payment_method === "visa") return;
        let a = e.target.value;


        // console.log(a);
        this.setState({student_details: {name: a}});
        // this.student_name_ref.value = e.target.value;
    };

    printey = async () => {

        // console.log(this.student_name_ref.value );
        if (this.state.payment_method === "meal plan" && this.myRef.value.length < 8) {
            const componentProps = {
                type: "defence",
                message: 'Student number too short.',
                variant: "contained",
                color: "info",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);
            return;
        }

        if (this.state.payment_method === "meal plan" && this.student_name_ref.value.length < 3) {
            const componentProps = {
                type: "defence",
                message: 'Student name too short.',
                variant: "contained",
                color: "info",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);
            return;
        }

        if (this.state.payment_method === "meal plan") {
            this.state.payment_detail = `${this.myRef.value} - ${this.student_name_ref.value}`
        }

        // get cashier at time of sale
        const user = await getUser(localStorage.getItem("token"));

        if (!user.user_id) {
            throw new Error("Could not get user.\nTransaction not saved");
        }

        // console.log(user);

        if (!user.isAdmin) {

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

        }

        const chan = this.state.payingNii - this.state.totalNii;

        this.setState({changeNii: chan});

        if (!this.state.dataSet || this.state.dataSet.length < 1) {

            const componentProps = {
                type: "defence",
                message: 'You have selected no items.',
                variant: "contained",
                color: "info",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);
            return;
        }
        if (chan < 0) {

            const componentProps = {
                type: "report",
                message: 'Change is less than 0?',
                variant: "contained",
                color: "secondary",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);
            return;
        }

        const columnDelimiter = "&emsp;";
        const lineDelimiter = "<br>";

        let company = company_name + lineDelimiter;
        let vendor = 1;
        let transaction_point = null;
        let cashier_name =
            "Cashier: " +
            (user.first_name + " " + user.last_name).substr(-company.length);
        let head = company + cashier_name;
        head += lineDelimiter + this.state.payment_method.toUpperCase();
        this.state.payment_method === "meal plan" ? head += lineDelimiter + this.state.payment_detail : head += null;

        let foot =
            `${lineDelimiter}Total:${columnDelimiter}${columnDelimiter}${columnDelimiter}${columnDelimiter}${this.state.totalNii.toFixed(2)}${lineDelimiter}Paid :${columnDelimiter}${columnDelimiter}${columnDelimiter}${columnDelimiter}${this.state.payingNii.toFixed(2)}${lineDelimiter}Change:${columnDelimiter}${columnDelimiter}${columnDelimiter}<strong>${this.state.changeNii.toFixed(2)}</strong>${lineDelimiter}050-248-0435${lineDelimiter}delcoker@gmail.com`;

        foot += lineDelimiter + moment((new Date())).format("llll");
        foot += lineDelimiter + "Items are valid for the day.";

        let content = convertArrayOfObjectsToPrint(
            head,
            this.state.dataSet,
            foot
        );
        if (content == null) {
            const componentProps = {
                type: "feedback",
                message: 'There are no items',
                variant: "contained",
                color: "info",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);
            return;
        }
        let pri = document.getElementById("contents_to_print").contentWindow;
        pri.document.open();
        pri.document.write(content);
        pri.document.close();

        if (
            window.confirm(`Are you sure you want to print:
                Total     ₵:     ${this.state.totalNii.toFixed(2)}
                Paying  ₵:     ${this.state.payingNii.toFixed(2)}
                Change₵:     ${this.state.changeNii.toFixed(2)}`)
        ) {
            let ids = [],
                qty = [];

            this.state.dataSet.forEach(item => {
                ids.push(item.id);
                qty.push(item.qty);
            });

            // ------------------- save transaction // saves as GMT

            let res = await this.saveTransactions(
                ids, qty, vendor,
                transaction_point,
                user.user_id,
                this.state.payment_method,
                this.state.payment_detail
            );

            if (res === 0) {
                const componentProps = {
                    type: "feedback",
                    message: 'One of the items will go below the quantity left',
                    variant: "contained",
                    color: "info",
                };

                toast(<Notification
                    className={classes.notificationComponent}
                    {...componentProps} />, toastOptions);
                return;
            }

            // -----------------------------------------------

            pri.focus();
            pri.print();

            this.deleteAllRows(ids);

            const componentProps = {
                type: "shipped",
                message: 'Success',
                variant: "contained",
                color: "success",
            };

            toast(<Notification
                className={classes.notificationComponent}
                {...componentProps} />, toastOptions);

            this.myRef.value = '';
            this.setState({payingNii: 0, changeNii: 0, student_details: {name: ''}});
        }
    };

    deleteAllRows = (ids) => {
        this.del_handleDel(ids);

        this.setState(state => ({toggleCleared: !state.toggleCleared}));
    };

    saveTransactions = async (ids, qty, vendor_id, transaction_point_id, user_id, payment_method, payment_detail) => {
        // console.log('user_id', user_id);
        // console.log('user_id', ids,)// qty, vendor_id, transaction_point_id, user_id);
        // console.log('qty', qty,)// qty, vendor_id, transaction_point_id, user_id);
        // console.log('ven', vendor_id,)// qty, vendor_id, transaction_point_id, user_id);
        // console.log('transa', parseFloat(this.state.totalNii))// qty, vendor_id, transaction_point_id, user_id);
        // console.log('payment_method', payment_method,);// qty, vendor_id, transaction_point_id, user_id);
        try {
            let res = await fetcher({
                query: SAVE_TRANSACTIONS,
                variables: {
                    total_amount: parseFloat(this.state.totalNii),
                    qtys: qty,
                    vendor_id,
                    transaction_point_id,
                    item_ids: ids,
                    user_id,
                    payment_method,
                    payment_detail
                }
            });

            return (res.data.saveTransaction);
        } catch (err) {
            console.log(err);
        }
    };

    renderItems = () => {
        const {classes} = this.props;
        const qty = 1;
        if (this.state.items && this.state.items.length > 0) {
            return this.state.items.map((item, i) => {
                let i_qty = item.has_stock ? " : " + item.quantity : '';
                return (
                    <Grid item lg={4} md={4} sm={6} xs={12} className='filterable'
                          key={i} onClick={() => this.handleCardClickChild(item, qty)}
                    >
                        <Widget
                            title={item.price.toFixed(2)}
                            item_name=
                                {<Img width={'43px'}
                                      src={[
                                          (this.getItemImage(item.pic) + '.svg'),
                                          this.getItemImage(item.pic) + '.gif',
                                          this.getItemImage(item.pic) + '.png',
                                          this.getItemImage(item.pic) + ".jpg",
                                          this.getItemImage(item.pic) + '.jpeg',
                                          logo]}
                                />}
                            upperTitle bodyClass={classes.fullHeightBody}
                            className={classes.card}>
                            <div className={classes.visitsNumberContainer}>
                                <Typography size="md" weight="medium">
                                    {item.name}
                                </Typography>
                            </div>
                            <Grid container direction="column"
                                  justify="space-between" alignItems="flex-start">
                                {i_qty
                                && <Grid item>
                                    <Typography
                                        color="text"
                                        colorBrightness="secondary">
                                        Stock {i_qty}
                                    </Typography>

                                </Grid>
                                }
                                <Grid item>
                                    <Typography color="text"
                                                colorBrightness="secondary">
                                        {item.category.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Widget>
                    </Grid>
                )
            });
        }
    };

    render() {
        // console.log(this.state);
        return (
            <>
                <Grid container item spacing={1} sm={7} xs={12}>
                    <Grid item sm={3} xs={12}>
                        <h2>Find Anything</h2>
                        <TextField id="myInput" placeholder="Search" type='text' color='primary'
                                   autoComplete='' fullWidth variant={"outlined"}
                                   inputProps={{style: textFieldStyle.resize}}
                                   name="search"
                            // helperText={'Type in here to find what you want'}
                        />
                    </Grid>
                    <Grid item sm={2} xs={12}>
                        <h2>Method</h2>
                        <FormControl
                            fullWidth
                            style={{margin: 0, style: textFieldStyle.resize,}}>
                            <InputLabel>Status</InputLabel>
                            <Select style={textFieldStyle.resize}
                                    id="standard-secondary" label="Payment Method"
                                    color="primary" onChange={this.handlePaymentMethodChange}
                                    defaultValue={'cash'} name='payment_method'>
                                <MenuItem
                                    style={textFieldStyle.resize}
                                    value={'cash'}>Cash</MenuItem>
                                <MenuItem style={textFieldStyle.resize}
                                          value={'meal plan'}>Meal Plan</MenuItem>
                                <MenuItem style={textFieldStyle.resize}
                                          value={'visa'}>Visa</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container item spacing={1} sm={7} xs={12}>

                        <Grid container item sm={5} xs={12}>
                            <h2>Student #</h2>
                            <TextField placeholder="Student Number" type='text' color='secondary'
                                       autoComplete='' fullWidth variant={"outlined"}
                                       inputProps={{style: textFieldStyle.resize}}
                                       label="Student Number" name="student_number"
                                // value={this.state.student_number_txt}
                                       onChange={this.handleStudentNumber}
                                // ref={this.myRef}
                                       inputRef={input => (this.myRef = input)}
                                // ref={'stud_num'}
                            />

                        </Grid>

                        <Grid container item sm={7} xs={12}>
                            <h2>Student Name</h2>
                            <TextField
                                label="Student Name"
                                placeholder="Name"
                                type='text' color='primary'
                                fullWidth variant={"standard"}
                                inputProps={{style: textFieldStyle.resize}}
                                inputRef={input => (this.student_name_ref = input)}
                                value={this.state.student_details ? this.state.student_details.name : ''}
                                name={'student_name'}
                                onChange={this.handleStudentName}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br/>
                <div id="subContent">
                    <Grid container className="flex-section">
                        <Grid container item spacing={2} sm={7} xs={12} className={"flex-col-scroll"}>
                            <Grid container item spacing={2} id="myContainer">

                                {/*<Grid container item spacing={2} sm={7} xs={12}>*/}
                                {this.renderItems()}
                                {/*</Grid>*/}

                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} sm={5} xs={12}>
                            <Grid item className={"flex-col-scroll"}>
                                {/*<Grid item xs={12}>*/}

                                {/*<Grid item xs={12}>*/}
                                <SaleList
                                    mData={this.state.dataSet}
                                    totalNii={this.state.totalNii}
                                    payingNii={this.state.payingNii}
                                    changeNii={this.state.changeNii}

                                    handlePayingChangeNii={this.handlePayingChangeNii}
                                    printey={this.printey}
                                    del_handleDelete={this.del_handleDel}

                                    handleNumberClick={this.handleNumberClicked}
                                />
                                {/*</Grid>*/}

                                {/*</Grid>*/}
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    }
}

// export default withStyles(useStyles, {withTheme: true})(MyLoginPage);
export default withStyles(useStyles, {withTheme: true})(Sales);


