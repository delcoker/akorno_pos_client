import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Checkbox, FormControl, FormControlLabel,
    Grid, InputLabel, makeStyles, MenuItem, Select
} from "@material-ui/core";
import Widget from "../../../components/Widget";
import {textFieldStyle} from "../../../_utils/inlineStyles";
import {Save as SaveIcon} from "@material-ui/icons";
import {fetcher, GET_CATEGORIES} from "../../../_utils/fetcher";


const useStyles = makeStyles(theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
}));

export default function FormDialog(props) {
    const [itemCategories, setItemCategories] = React.useState([]);

    const classes = useStyles();

    const fetchItemCategories = async () => {
        try {
            let res = await fetcher({
                query: GET_CATEGORIES,
            });
            let itemCategories = res.data.getItemCategories;
            setItemCategories(itemCategories);
        } catch (err) {
            console.log(err);
        }
    };


    const renderItemCategories = () => {
        // console.log(itemCategories);
        if (itemCategories && itemCategories.length > 0) {
            return (
                itemCategories.map((itemCategory, i) => {
                    return (
                        <MenuItem
                            style={textFieldStyle.resize}
                            key={itemCategory.id}
                            value={itemCategory.id}
                        >
                            {itemCategory.name}
                        </MenuItem>
                    );
                })
            )
        }
        return null;
    };

    useEffect(() => {
        fetchItemCategories();
    }, []);

    return (
        <div>

            <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title"
                    maxWidth={'md'} //saveNewItem={props.saveNewItem}
                    keepMounted onExit={props.onClose}>
                <DialogTitle id="form-dialog-title">Add New Item</DialogTitle>
                <DialogContent>

                    <form className={classes.form} noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        props.saveNewItem(e); /*this.handleClose();*/
                    }}>

                        <Widget disableWidgetMenu>
                            <Grid container spacing={3} justify="space-around">
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        required label="Name" color="primary" fullWidth
                                        autoComplete="i_name" name='item_name'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id="standard-secondar" label="Price"
                                        inputProps={{step: "0.50", min: "-5.00", style: textFieldStyle.resize}}
                                        color="primary" type='number'
                                        fullWidth autoComplete="i_price" required
                                        defaultValue={parseFloat(1).toFixed(2)} name='item_price'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Category</InputLabel>

                                        <Select
                                            style={textFieldStyle.resize}
                                            color="secondary"
                                            name='item_category'
                                            defaultValue={3}
                                        >
                                            {renderItemCategories()}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        fullWidth id="standard-second" label="Picture"
                                        color="primary"
                                        name='item_pic'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            id="standard-secondary"
                                            label="Has Stock" color="primary"
                                            name='has_stock'
                                        />}
                                        label="Has Stock"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        id="standard-second" label="Min Stock"
                                        color="primary"
                                        inputProps={{step: "1", min: "0", style: textFieldStyle.resize}}
                                        name='min_stock' type='number'/>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControl
                                        fullWidth
                                        style={{margin: 0, style: textFieldStyle.resize,}}>
                                        <InputLabel>Status</InputLabel>
                                        <Select style={textFieldStyle.resize}
                                                id="standard-secondary" label="Status"
                                                color="primary"
                                                defaultValue={'enabled'} name='status'>
                                            <MenuItem
                                                style={textFieldStyle.resize}
                                                value={'enabled'}>Enabled</MenuItem>
                                            <MenuItem style={textFieldStyle.resize}
                                                      value={'disabled'}>Disabled</MenuItem>
                                            <MenuItem style={textFieldStyle.resize}
                                                      value={'deleted'}>Deleted</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button fullWidth type='submit'
                                            style={textFieldStyle.resize}
                                            color='primary' variant="contained"
                                            startIcon={<SaveIcon/>}>Add</Button>
                                </Grid>
                            </Grid>
                        </Widget>
                    </form>

                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
