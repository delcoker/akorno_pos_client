import React, {Component} from 'react';
import {MenuItem, Select} from "@material-ui/core";
import {CATEGORIES, fetcher} from "../../../_services/fetcher";

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
    }

    renderItemCategories = () => {
        if (this.state.itemCategories && this.state.itemCategories.length > 0) {
            return (
                this.state.itemCategories.map((itemCategory, i) => (
                    <MenuItem key={itemCategory.id} value={itemCategory.id}>{itemCategory.name}</MenuItem>
                ))
            )
        }
        return null;
    }

    render() {
        return (
            <Select color="secondary" /*defaultValue={data.category.id}*/
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
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
