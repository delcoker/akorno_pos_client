import React, {Component} from "react";
import {
    Grid,
} from "@material-ui/core";

// styles
// import useStyles from "./styles";
// import {withStyles} from "@material-ui/core/styles"

import Img from 'react-image';

import logo from '../../images/google.svg';
// components
import Widget from "../../components/Widget";
import PageTitle from "../../components/PageTitle";
import {Typography} from "../../components/Wrappers";

import {
    CHECK_USER_SESSION,
    convertArrayOfObjectsToPrint,
    ENABLED_ITEMS,
    fetcher,
    getUser,
    isAnyShiftActive, SAVE_TRANSACTIONS, START_SHIFT
} from "../../_utils/fetcher";

import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SaleList from "./compnonents/SaleList";
import {YourAwesomeComponent} from "../../components/FAB/YourAwesomeComponent";
import {toast} from "react-toastify";
import Notification from "../../components/Notification";

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

// var classes = useStyles();
// var theme = useTheme();

const $ = require('jquery');

// let API_KEY = "AIzaSyDXAm8fyR9alMVpg_Gq0-JfO6Yw_Kq7wQg";
// let ENGINE_ID = "012568330619765078995:hgynjoenxeu";

class Sales extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items_list: new Map(),
            totalNii: 0,
            payingNii: 0,
            changeNii: 0,
            dataSet: []
        };
        // this.mDataSetR = [];

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

    del_handleDel = (ids, selectedRows) => {

        const deleted_ids = ids ? ids : selectedRows.map(item => item.id);
        let temp = this.handleItemDelete2(deleted_ids);
        this.getClickedItemsAsArray(temp);

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

        // console.log(dataFromChild, qty);

        const map = new Map(this.state.items_list);

        for (let [k, v] of map) {
            if (k.id === dataFromChild.id) { // means it's contained in list
                qty += v;
                map.delete(k);
                break;
            }
        }

        map.set(dataFromChild, qty);

        this.getClickedItemsAsArray(map);

        this.setState({
            items_list: map,
            // dataSet: dat
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

            // console.log(this.state);

            // this.setState({
            //     totalNii: tot,
            //     changeNii: this.state.payingNii - tot,
            //     dataSet: mDataSet
            // });
        });
        // console.log(mDataSet);
        this.setState({
            totalNii: tot,
            changeNii: this.state.payingNii - tot,
            dataSet: mDataSet
        });
        // return mDataSet;
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

    renderItems = () => {
        const {classes} = this.props;
        const qty = 1;
        if (this.state.items && this.state.items.length > 0) {
            return this.state.items.map((item, i) => {
                let i_qty = item.has_stock ? " : " + item.quantity : '';
                return (
                    <Grid item lg={3} md={4} sm={6} xs={12} className='filterable'
                          key={i} onClick={() => this.handleCardClickChild(item, qty)}>
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
                                    <Typography color="text" colorBrightness="secondary">
                                        Stock {i_qty}
                                    </Typography>

                                </Grid>
                                }
                                <Grid item>
                                    <Typography color="text" colorBrightness="secondary">
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

    handlePayingChangeNii = (paying) => {
        const change = (paying - this.state.totalNii).toFixed(2);

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

    printey = async () => {
        // get cashier at time of sale
        const user = await getUser(localStorage.getItem("token"));

        if (!user.user_id) {
            throw new Error("Could not get user.\nTransaction not saved");
        }

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

        const chan = this.state.payingNii - this.state.totalNii;

        this.setState({changeNii: chan});

        if (!this.state.dataSet || this.state.dataSet.length < 1 ||
            chan < 0) {

            const notification = {
                display: "flex",
                alignItems: "center",
                background: "transparent",
                boxShadow: "none",
                overflow: "visible",
            };

            const progress = {
                visibility: "hidden",
            };

            const toastOptions = {
                className: notification,
                progressClassName: progress
            };

            const componentProps = {
                type: "shipped",
                message: 'Less than 0?',
                variant: "contained",
                color: "success",
            };

            // console.log('toastOptions', toastOptions);
            toast(<Notification
                {...componentProps}
                // className={classes.notificationComponent}
            />, toastOptions);

            return;
        }

        const columnDelimiter = "&emsp;";
        const lineDelimiter = "<br>";

        let company = "AKORNO CATERING SERVICES <br>";
        let vendor = 1;
        let transaction_point = null;
        let cashier_name =
            "Cashier: " +
            (user.first_name + " " + user.last_name).substr(-company.length);
        let head = company + cashier_name;


        let foot =
            lineDelimiter +
            "Total:" +
            columnDelimiter + columnDelimiter +
            columnDelimiter + columnDelimiter +
            this.state.totalNii.toFixed(2) +
            lineDelimiter +
            "Paid :" +
            columnDelimiter + columnDelimiter +
            columnDelimiter + columnDelimiter +
            this.state.payingNii.toFixed(2) +
            lineDelimiter +
            "Change:" +
            columnDelimiter + columnDelimiter +
            columnDelimiter +
            "<strong>" + this.state.changeNii.toFixed(2) + "</strong>" +
            lineDelimiter +
            "050-248-0435";

        let content = convertArrayOfObjectsToPrint(
            head,
            this.state.dataSet,
            foot
        );
        if (content == null) return;

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
                user.user_id
            );

            if (res === 0) {
                alert("One of the items will go below the quantity left");
                return;
            }

            // -----------------------------------------------

            pri.focus();
            pri.print();

            this.deleteAllRows( ids);
            this.setState({payingNii: 0, changeNii: 0});
        }
    };

    deleteAllRows =  (ids) => {
        this.del_handleDel(ids);

        this.setState(state => ({toggleCleared: !state.toggleCleared}));
    };

    saveTransactions = async (ids, qty, vendor_id, transaction_point_id, user_id) => {
        // console.log('user_id', user_id);
        try {
            let res = await fetcher({
                query: SAVE_TRANSACTIONS,
                variables: {
                    total_amount: this.state.totalNii,
                    qtys: qty,
                    vendor_id,
                    transaction_point_id,
                    item_ids: ids,
                    user_id
                }
            });

            return (res.data.saveTransaction);
        } catch (err) {
            console.log(err);
        }
    };


    render() {
        // console.log(this.state);
        return (
            <>
                <PageTitle title="Sales"/>
                <h2>Find Anything</h2>

                <Grid container item spacing={1} sm={6} xs={12}>
                    <TextField id="myInput" placeholder="Search" type='text' color='primary'
                               autoComplete='' fullWidth variant={"outlined"}
                               helperText={'Type in here to find what you want'}/>

                </Grid>
                <br/>
                <Grid container spacing={1} id="myContainer">


                    <Grid container item spacing={1} sm={6} xs={12}>
                        {this.renderItems()}
                    </Grid>

                    <Grid container item spacing={1} sm={6} xs={12}>
                        <Grid item xs={12}>
                            <SaleList
                                mData={this.state.dataSet}
                                totalNii={this.state.totalNii}
                                payingNii={this.state.payingNii}
                                changeNii={this.state.changeNii}

                                handlePayingChangeNii={this.handlePayingChangeNii}
                                printey={this.printey}
                                del_handleDelete={this.del_handleDel}
                            />
                        </Grid>

                    </Grid>
                </Grid>


            </>
        );
    }
}

// export default withStyles(useStyles, {withTheme: true})(MyLoginPage);
export default withStyles(useStyles, {withTheme: true})(Sales);


