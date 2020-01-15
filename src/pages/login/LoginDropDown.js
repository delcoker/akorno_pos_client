import React, {Component} from 'react';
import {Select, MenuItem} from '@material-ui/core';
import { textFieldStyle } from "../../_utils/inlineStyles";

class LoginDropDown extends Component {
    renderUsers = () => {
        if (this.props.users && this.props.users.length > 0) {
            return (
                this.props.users.map((user, i) => (
                    <MenuItem
                        style={textFieldStyle.resize}
                        key={i}
                        value={user.email.email}>
                        {user.first_name + " " + user.last_name}
                    </MenuItem>
                ))
            )
        }
        return null;
    };

    render() {
        const {registerEmail} = this.props;

        return (
            <Select
                style={textFieldStyle.resize}
                required variant="outlined"
                autoFocus fullWidth
                name='registerUsername'
                onChange={this.props.handleDropdownChange}
                value={registerEmail}>
                {this.renderUsers()}
            </Select>
        );
    }
}

export default LoginDropDown;
