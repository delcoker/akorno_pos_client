import {Container} from "react-floating-action-button";
import {Grid, TextField} from "@material-ui/core";
import React, {Component} from "react";
import IconButton from "@material-ui/core/IconButton";
import {Print} from "@material-ui/icons";
import InputAdornment from "@material-ui/core/InputAdornment";

const containerStyle = {
    right: '0vw',
    width: '300px',
    top: '4vw'
};
const textFieldStyle = {
    resize: {
        fontSize: 30
    },
};

export class YourAwesomeComponent extends Component {
    constructor(props) {
        super(props);
        // console.log(props);
        // this.tot = 0;
        // this.amount_paying = 0;
        this.change = 0;

        // this.yacTotal=this.props.slTotal;
        // this.yacAmtPaying=this.props.slAmtPaying;
        // this.yacChange = this.props.slChange;
        //
        // console.log(this.yacTotal, this.yacAmtPaying, this.yacChange);
    }

    handlePayingValueChange = (e) => {
        const amount_paying = parseFloat(e.target.value);
        // // console.log(this.amount_paying );
        // const change = (this.amount_paying - this.props.total).toFixed(2);
        //
        // this.props.handlePayingPar(this.change, this.amount_paying); // send to parent
        // console.log("here", this.yacTotal);
        this.props.handlePayingChangeNii(amount_paying);
    };

    handleClick = (e) => {
        // input type number does not support selection
        const {target} = e;
        // const extensionStarts = target.value.lastIndexOf('.');
        target.focus();
        // target.setSelectionRange(0, extensionStarts);
    };

    calculateChange = () => {
        const { totalNii, payingNii } = this.props;

        return (payingNii - totalNii).toFixed(2);
    };


    render() {
        const { totalNii, payingNii } = this.props;

        return (

            <Container styles={containerStyle}>
                <Grid container spacing={1}>
                    <Grid container item spacing={1} xs={6} justify='space-around'>
                        <IconButton size="medium"
                                    style={{
                                        height: "90px",
                                        width: "90px"
                                    }}
                                    onClick={this.props.printey}>
                            <Print color="primary" fontSize='large'/>
                        </IconButton>
                    </Grid>
                    <Grid container item spacing={1} xs={6}>
                        <TextField
                            id="total"
                            label="Total ₵"
                            placeholder="Total ₵"
                           InputProps={{
                                style: textFieldStyle.resize,
                                startAdornment: <InputAdornment
                                    position="start">₵</InputAdornment>,
                            }}
                            type='number'
                            color='primary'
                            value={totalNii}
                            disabled
                        />

                        <TextField
                            id="paying"
                            label="Paying ₵"
                            placeholder="Paying ₵"
                            InputProps={{
                                style: {fontSize: 30},
                                startAdornment: <InputAdornment
                                    position="start">₵</InputAdornment>,
                            }}
                            margin="normal"
                            autoFocus={true}
                            color='secondary'
                            type='number'
                            value={payingNii}
                            onClick={this.handleClick}
                            // helperText={"Amount received from customer"}
                            onChange={this.handlePayingValueChange}
                        />

                        <TextField
                            id="change"
                            label="Change ₵"
                            placeholder="Change ₵"
                            InputProps={{
                                style: textFieldStyle.resize,
                                startAdornment: <InputAdornment
                                    position="start">₵</InputAdornment>,
                            }}
                            disabled
                            type='number'
                            color='secondary'
                            value={this.calculateChange()}
                            // autoFocus={true}
                            // helperText={"Amount in change to customer"}
                        />
                        {/*<br/>*/}
                        {/*<Button*/}
                        {/*    tooltip="The big plus button!"*/}
                        {/*    icon={HomeIcon}*/}
                        {/*    rotate={true}*/}
                        {/*    onClick={() => alert('FAB Rocks!')}/>*/}
                    </Grid>
                </Grid>
            </Container>
        )
    }
}
