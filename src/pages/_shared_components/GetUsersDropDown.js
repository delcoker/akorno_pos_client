import React, { Component } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import { fetcher, USERS } from "../../_utils/fetcher";
import { textFieldStyle } from "../../_utils/inlineStyles";


class GetUsersDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
        this.fetchUsers();
    }

    fetchUsers = async () => {
        try {
            let res = await fetcher({
                query: USERS
            });
            let users = res.data.allUsersNoAdmin;
            this.setState({ users });
        } catch (err) {
            console.log(err);
        }
    };

    renderUsers = () => {
        if (this.state.users && this.state.users.length > 0) {
            return this.state.users.map((user, i) => {
                return (
                    <MenuItem
                        onClick={this.props.handleDropDownHTML}
                        style={textFieldStyle.resize}
                        key={user.user_id} value={user.user_id}>
                        {user.first_name + " " + user.last_name}
                    </MenuItem>
                );
            });
        }
        return null;
    };

    render() {
        return (
            <FormControl style={{ marginTop: '10px' }} fullWidth>
                <InputLabel>Report On:</InputLabel>
                <Select
                    color="secondary"
                    labelId="demo-simple-select-label"
                    id="users"
                    name="users_list"
                    value={this.props.loggedUserId}
                    style={textFieldStyle.resize}
                    onChange={this.props.handleDropDownChange}
                >
                    <MenuItem
                        style={textFieldStyle.resize}
                        key={-1} value={-1} onClick={this.props.handleDropDownHTML}>
                        {"Everyone"}
                    </MenuItem>
                    {this.renderUsers()}
                </Select>
            </FormControl>
        );
    }
}

export default GetUsersDropDown;
