import React, {Fragment} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {textFieldStyle} from "../../_utils/inlineStyles";
import {Close} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";

const FilterComponent = (props) =>
    <Fragment>
        <TextField
            id="search" type="text" variant="standard"
            placeholder="Filter by Name"
            value={props.filterText}
            onChange={props.onFilter}
            inputProps={{style: textFieldStyle.resize,}}
        />
        <Tooltip title="Clear Text">
            <IconButton onClick={props.onClear}>
                <Close fontSize={'large'} style={{fill: "red"}}/>
            </IconButton>
        </Tooltip>
    </Fragment>

export default FilterComponent;
