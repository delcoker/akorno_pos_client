import {Container} from "react-floating-action-button";
import {Grid, TextField} from "@material-ui/core";
import React, {Component} from "react";
import IconButton from "@material-ui/core/IconButton";
import {
    Filter1, Filter2, Filter3, Filter4, Filter5, Filter6,
    Filter7, Filter8, Filter9, ExposureZero, Print, HighlightOff
} from "@material-ui/icons";
import InputAdornment from "@material-ui/core/InputAdornment";
import $ from "jquery";

const containerStyle = {
    right: '-1.5vw',
    width: '500px',
    top: '4.2vw',
    height: '90px'
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
        this.props.handlePayingChangeNii(amount_paying);
    };

    handleClick = (e) => {
        e.target.select();
        // input type number does not support selection
        // const {target} = e;
        // console.log(e.());
        // console.log(e.nativeEvent.toElement.focus());

        // const extensionStarts = target.value.lastIndexOf('.');
        // target.highlight();
        // target.setSelectionRange(0, 1);
        // target.select();
    };

    calculateChange = () => {
        const {totalNii} = this.props;
        let {payingNii} = this.props;

        // console.log(payingNii);

        if (!(payingNii > 0)) payingNii = 0;

        return (payingNii - totalNii).toFixed(2);
    };


    render() {
        const {totalNii, payingNii} = this.props;

        return (

            <Container styles={containerStyle}>
                <Grid container spacing={1}>
                    <Grid container item spacing={1} xs={10}>
                        <Grid item xs={4}>
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
                        </Grid>
                        <Grid item xs={4}>

                            <TextField
                                id="paying"
                                label="Paying ₵"
                                placeholder="Paying ₵"
                                InputProps={{
                                    style: {fontSize: 30},
                                    startAdornment: <InputAdornment
                                        position="start">₵</InputAdornment>,
                                }}
                                margin="none"
                                autoFocus={true}
                                color='secondary'
                                type='number'
                                value={payingNii}
                                onClick={this.handleClick}
                                // helperText={"Amount received from customer"}
                                onChange={this.handlePayingValueChange}
                            />
                        </Grid>
                        <Grid item xs={4}>

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

                    <Grid container item spacing={1} xs={2} justify='space-around'>
                        <IconButton size="medium"
                                    style={{
                                        height: "80px",
                                        width: "80px"
                                    }}
                                    onClick={this.props.printey}>
                            <Print color="primary" fontSize='large'/>
                        </IconButton>
                    </Grid>

                    <Grid container item spacing={3} xs={12}>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 1)}>
                                <Filter1 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 2)}>
                                <Filter2 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 3)}>
                                <Filter3 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 4)}>
                                <Filter4 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 5)}>
                                <Filter5 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 6)}>
                                <Filter6 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 7)}>
                                <Filter7 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 8)}>
                                <Filter8 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 9)}>
                                <Filter9 fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 0)}>
                                <ExposureZero fontSize='large'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, '')}>
                                <HighlightOff fontSize='large' color={"error"}/>
                            </IconButton>
                        </Grid>
                        {/*<Grid item xs={1}>*/}
                        {/*    <IconButton color="secondary" onClick={e => this.props.handleNumberClick(e, 0)}>*/}
                        {/*        <Close/>*/}
                        {/*    </IconButton>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
            </Container>
        )
    }
}
