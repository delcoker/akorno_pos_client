import React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {textFieldStyle} from "../../_utils/inlineStyles";

export default function CardItem(props) {
    return (
        <>
            <FormControl
                fullWidth
                style={props.formStyle}>
                <InputLabel>Payment Method</InputLabel>
                <Select style={props.selectStyle}
                        id="standard-secondary" label="Payment Method"
                        color="primary" onChange={props.handlePaymentMethodChange}
                        defaultValue={'cash'} name='payment_method'>
                    <MenuItem
                        style={textFieldStyle.resize}
                        value={'cash'}>Cash</MenuItem>
                    <MenuItem style={textFieldStyle.resize}
                              value={'meal plan'}>Meal Plan</MenuItem>
                    <MenuItem style={textFieldStyle.resize}
                              value={'visa'}>Visa</MenuItem>
                    <MenuItem style={textFieldStyle.resize}
                              value={'momo'}>MoMo</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}
