import React, {Component} from 'react';
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {CATEGORIES, fetcher} from "../../../_services/fetcher";

const textFieldStyle = {
    resize: {
        fontSize: 20
    },
};

class GetCategoriesDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCategories: []
        }
        this.fetchItemCategories();
    }

    fetchItemCategories = async () => {
        try {
            let res = await fetcher({
                query: CATEGORIES,
            });
            let itemCategories = res.data.getItemCategories;
            this.setState({itemCategories});

        } catch (err) {
            console.log(err);
        }
    };

    renderItemCategories = () => {
        if (this.state.itemCategories && this.state.itemCategories.length > 0) {
            return (
                this.state.itemCategories.map((itemCategory, i) => (
                    <MenuItem
                        style={textFieldStyle.resize}
                        key={itemCategory.id}
                        value={itemCategory.id}>
                        {itemCategory.name}
                    </MenuItem>
                ))
            )
        }
        return null;
    };

    render() {
        return (
            <Select
                style={textFieldStyle.resize}
                color="secondary" /*defaultValue={data.category.id}*/
                name='item_category'
                value={this.props.category_id}
                onChange={this.props.changeHandler}>
                {/*onChange={(event, name) => {this.props.changeHandler(event); /*console.log(name)*!/}>*/}
                {this.renderItemCategories()}
            </Select>
        );
    }
}

export default GetCategoriesDropDown;
