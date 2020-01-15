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
                <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
                <DialogContent>

                    <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        props.saveNewUser(e); /*this.handleClose();*/
                    }}>

                        <Widget title={'User Details'} disableWidgetMenu>
                            <Grid container spacing={3} justify="space-around"
                                  className={classes.dashedBorder}>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        required
                                        label="First Name" color="primary" fullWidth
                                        autoComplete="i_name" name='first_name'
                                        // defaultValue={data.first_name}
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        // required
                                        label="Other Names" color="primary" fullWidth
                                        autoComplete="i_name" name='other_names'
                                        // defaultValue={data.other_names}
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Last Name"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="name" required
                                        // defaultValue={(data.last_name)}
                                        name='last_name'
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            id="standard-secondary"
                                            label="Is Admin" color="primary"
                                            name='is_admin' required
                                            // onChange={this.handleChange}
                                            defaultChecked={false}/>}
                                        label="Is Admin"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="email" required
                                        // defaultValue={(data.email.email)}
                                        name='email'
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Telephone" type={'tel'}
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="tel" required
                                        // defaultValue={(data.telephone)}
                                        name='telephone'
                                        // onChange={this.handleChange}
                                    />
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
                                                defaultValue={"enabled"} name='status'>
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
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        label="Address" multiline={true}
                                        rows={1} rowsMax={4}
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="address"
                                        // defaultValue={(data.postal_address)}
                                        name='postal_address'
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Picture"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="i_price" //required
                                        // defaultValue={(data.pic)}
                                        name='picture'
                                        // onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button fullWidth type='submit'
                                            style={textFieldStyle.resize}
                                            color='primary' variant="contained"
                                            startIcon={<SaveIcon/>}>Add</Button>
                                </Grid>
                            </Grid>

                        </Widget>
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                    </form>

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