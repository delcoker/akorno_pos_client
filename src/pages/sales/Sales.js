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

import {ENABLED_ITEMS, fetcher} from "../../_services/fetcher";

import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SaleList from "./compnonents/SaleList";

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
            tot: 0
        };
        this.tot = 0;
        this.mDataSetR = [];

        this.fetchItems();
        this.addFindAnythingFilter();
    }

    componentDidMount() {
    };

    addFindAnythingFilter() {
        $("#myInput").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            // console.log(value); // actually don't need #myContainer
            $("#myContainer .filterable").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
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
            return items;

        } catch (err) {
            console.log(err);
        }
    };

    del_handleDel = async (indices) => {
        // console.log("delete",indices);
        // this.props.del_handleItemDelete(dataFromChildToDelete);

        let temp = this.handleItemDelete2(indices);
        await this.setState({item_list: this.getClickedItemsAsArray(temp), tot: this.tot});

    };

    handleItemDelete2 = (indices) => {
        // console.log(this.state.items_list);
        const map = this.state.items_list;


        // const newMap = new Map(map);  // apparently this is a shallow copy - not sure
        // console.log(newMap)

        map.forEach((value, keyObj) => {
            // console.log("keyObj", keyObj)
            indices.forEach((valu) => {
                // console.log("valu", valu)
                if (keyObj.id === valu) {
                    map.delete(keyObj);
                }
            });
        });
        // console.log('newMap- ', newMap)
        // console.log('map- ', map)
        this.setState({items_list: map});
        // console.log(this.state.items_list);
        // console.log(map);
        return map;

    };

    // when a card is clicked
    handleCardClickChild = async (dataFromChild, qty) => {

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

        this.mDataSetR = this.getClickedItemsAsArray(map);

        this.setState({
            items_list: map,
            // data: this.mDataSetR,
            // tot: this.tot
        });

        // console.log(this.state);


        // await this.props.del_handleCardClickParent(dataFromChild, quantity);
        // this.setState({
        //     items_list2: this.props.items_list_content,
        // });
    };

    getClickedItemsAsArray = (mp) => {

        this.mDataSetR = [];
        this.tot = 0;
        mp.forEach((value, key) => {
            if (key.name) {
                this.mDataSetR.push({
                    pic: key.pic,
                    item: key.name,
                    price: key.price.toFixed(2),
                    type: key.category.name,
                    qty: value,
                    subtotal: (value * key.price).toFixed(2),
                    id: key.id
                });
            }
            this.tot += value * key.price;
        });
        // console.log(this.mDataSetR)
        return this.mDataSetR;
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

    render() {
        // const {classes, theme} = this.props;
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
                            <SaleList del_handleDelete={this.del_handleDel}
                                      mData={this.mDataSetR}
                                      mTotal={this.tot}/>
                        </Grid>

                    </Grid>
                    <Grid container item spacing={1} sm={6} xs={12}>
                    </Grid>
                </Grid>


            </>
        );
    }
}

// export default withStyles(useStyles, {withTheme: true})(MyLoginPage);
export default withStyles(useStyles, {withTheme: true})(Sales);


