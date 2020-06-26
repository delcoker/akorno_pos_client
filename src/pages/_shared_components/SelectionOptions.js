import React, {Component} from 'react';
import Widget from "../../components/Widget";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {Grid} from "@material-ui/core";
import PaymentOptions from "./PaymentOptions";
import {textFieldStyle} from "../../_utils/inlineStyles";
import GetUsersDropDown from "./GetUsersDropDown";
import IconButton from "@material-ui/core/IconButton";
import {Print} from "@material-ui/icons";

class SelectionOptions extends Component {
    render() {
        return (

            <Widget disableWidgetMenu>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={3} justify="space-around">

                        {this.props.handlePaymentMethodChange &&
                        <Grid item lg={2} md={5} sm={6} xs={12}>
                            <PaymentOptions
                                handlePaymentMethodChange={this.props.handlePaymentMethodChange}
                                selectStyle={textFieldStyle.resize}
                                menuStyle={textFieldStyle.resize}
                                formStyle={{style: textFieldStyle.resize, marginTop: '10px'}}
                            />
                        </Grid>}

                        {this.props.handleStartDateChange &&
                        <Grid item lg={3} md={5} sm={6} xs={12}>
                            <KeyboardDateTimePicker
                                // disableToolbar
                                fullWidth
                                inputVariant="outlined"
                                variant="inline"
                                format="dd-MMM-yyyy hh:mm a"
                                margin="normal"
                                id="start_date"
                                label="Start Date"
                                value={this.props.startDate}
                                onChange={this.props.handleStartDateChange}
                                inputProps={{
                                    style: textFieldStyle.resize,
                                }}
                            />
                        </Grid>}

                        {this.props.handleEndDateChange &&
                        <Grid item lg={3} md={5} sm={6} xs={12}>
                            <KeyboardDateTimePicker
                                fullWidth
                                label="End Date"
                                inputVariant="outlined"
                                variant="inline"
                                margin="normal"
                                id="end_date"
                                value={this.props.endDate}
                                onChange={this.props.handleEndDateChange}
                                format="dd-MMM-yyyy hh:mm a"
                                ampm={true}
                                inputProps={{
                                    style: textFieldStyle.resize,
                                }}
                            />
                        </Grid>}

                        {this.props.handleDropDownChange &&
                        <Grid item lg={3} md={5} sm={6} xs={12}>
                            <GetUsersDropDown
                                loggedUserId={this.props.user_id}
                                handleDropDownChange={this.props.handleDropDownChange}
                            />
                        </Grid>}

                        {this.props.runReport &&
                        <Grid item xs={1}>

                            <IconButton size="medium"
                                        style={{
                                            height: "100px",
                                            width: "100px"
                                        }}
                                        onClick={this.props.runReport}>
                                <Print color="secondary"
                                       fontSize='large'/>
                            </IconButton>
                        </Grid>}
                    </Grid>
                </MuiPickersUtilsProvider>
            </Widget>
        );
    }
}

export default SelectionOptions;
