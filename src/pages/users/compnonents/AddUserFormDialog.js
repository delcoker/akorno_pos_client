import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Select
} from "@material-ui/core";
import Widget from "../../../components/Widget";
import {textFieldStyle} from "../../../_utils/inlineStyles";
import GetItemCategoriesDropDown from "../../_shared_components/GetItemCategoriesDropDown";
import {Save as SaveIcon} from "@material-ui/icons";
import Slide from "@material-ui/core/Slide";


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

    const classes = useStyles();

    // const [open, setOpen] = React.useState(false);

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleChangeDropDown = () => {
        console.log("this")
    };

    return (
        <div>
            {/*<Button variant="outlined" color="primary" onClick={handleClickOpen}>*/}
            {/*    Open form dialog*/}
            {/*</Button>*/}
            <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title"
                    maxWidth={'md'} //saveNewItem={props.saveNewItem}
                    keepMounted onExit={props.onClose}>
                <DialogTitle id="form-dialog-title">Add New Item</DialogTitle>
                <DialogContent>
                    {/*<Grid container spacing={3} direction="row"*/}
                    {/*      justify="center" alignItems="center">*/}

                    {/*    <Grid item xs={7}>*/}


                    <form className={classes.form} noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        props.saveNewItem(e); /*this.handleClose();*/
                    }}>
                        {/*{console.log(classes.textFieldStyle)}*/}
                        {/*{console.log(textFieldStyle.resize)}*/}

                        <Widget disableWidgetMenu>
                            <Grid container spacing={3} justify="space-around"
                                // className={classes.dashedBorder}
                            >
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        required label="Name" color="primary" fullWidth
                                        autoComplete="i_name" name='item_name'
                                        // defaultValue={data.name}
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id="standard-secondar" label="Price"
                                        inputProps={{step: "0.50", min: "0.00", style: textFieldStyle.resize}}
                                        color="primary" type='number'
                                        fullWidth autoComplete="i_price" required
                                        defaultValue={parseFloat(1).toFixed(2)} name='item_price'
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Category</InputLabel>
                                        <GetItemCategoriesDropDown
                                            category_id={1}
                                            changeHandler={(e) => {
                                                handleChangeDropDown(e)
                                            }}/>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        fullWidth id="standard-second" label="Picture"
                                        color="primary"
                                        // onChange={this.handleChange}
                                        // defaultValue={data.pic}
                                        name='item_pic'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            id="standard-secondary"
                                            label="Has Stock" color="primary"
                                            name='has_stock'
                                            // onChange={this.handleChange}
                                            // defaultChecked={data.has_stock}
                                        />}
                                        label="Has Stock"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        id="standard-second" label="Min Stock"
                                        color="primary"
                                        inputProps={{step: "1", min: "0", style: textFieldStyle.resize}}
                                        // onChange={this.handleChange}
                                        // defaultValue={1}
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
                                            // onChange={this.handleChange}
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
                                            startIcon={<SaveIcon/>}>Save</Button>
                                </Grid>
                            </Grid>

                        </Widget>
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </form>

                    {/*</Grid>*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary">
                        Cancel
                    </Button>
                    {/*<Button onClick={props.onClose} color="primary">*/}
                    {/*    Subscribe*/}
                    {/*</Button>*/}
                </DialogActions>
            </Dialog>
        </div>
    );
}