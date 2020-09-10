import React from 'react';
import {Grid} from "@material-ui/core";
import Widget from "../../../components/Widget";
import Img from "react-image";
import logo from "../../../images/google.svg";
import {Typography} from "../../../components/Wrappers";

export default function CardItem(props) {
    return (

        <Grid item lg={4} md={4} sm={6} xs={12} className='filterable'
              onClick={() => {
                  props.handleCardClickChild(props.item, props.qty);
              }}>
            <Widget
                title={props.item.price.toFixed(2)}
                item_name={
                     <Img width={'43px'}
                         src={[
                             (props.getItemImage(props.item.pic) + '.svg'),
                             props.getItemImage(props.item.pic) + '.gif',
                             props.getItemImage(props.item.pic) + '.png',
                             props.getItemImage(props.item.pic) + ".jpg",
                             props.getItemImage(props.item.pic) + '.jpeg',
                             (props.getItemImage(props.item.name) + '.svg'),
                             props.getItemImage(props.item.name) + '.gif',
                             props.getItemImage(props.item.name) + '.png',
                             props.getItemImage(props.item.name) + ".jpg",
                             props.getItemImage(props.item.name) + '.jpeg',
                             logo
                         ]}
                    />
                }
                upperTitle bodyClass={props.classes.fullHeightBody}
                className={props.classes.card}>
                <div className={props.classes.visitsNumberContainer}>
                    <Typography size="md" weight="medium">
                        {props.item.name}
                    </Typography>
                </div>
                <Grid container direction="column"
                      justify="space-between" alignItems="flex-start">
                    {props.i_qty
                    && <Grid item>
                        <Typography
                            color="text"
                            colorBrightness="secondary">
                            Stock {props.i_qty}
                        </Typography>

                    </Grid>
                    }
                    <Grid item>
                        <Typography
                            color="text"
                            colorBrightness="secondary">
                            {props.item.category.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Widget>
        </Grid>
    );
}
