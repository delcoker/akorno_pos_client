import React, {Component} from 'react';
import {MenuItem, Select} from "@material-ui/core";
import {GET_CATEGORIES, fetcher} from "../../_utils/fetcher";

const textFieldStyle = {
    resize: {
        fontSize: 20
    },
};

class GetItemCategoriesDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCategories: []
        };

    }

    componentDidMount() {
        this.fetchItemCategories();
    }

    fetchItemCategories = async () => {
        try {
            let res = await fetcher({
                query: GET_CATEGORIES,
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
                renderdalue={1}
                onChange={this.props.changeHandler}
            >
                {this.renderItemCategories()}
            </Select>
        );
    }
}

export default GetItemCategoriesDropDown;
