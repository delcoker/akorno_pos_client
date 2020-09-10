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
import {Cancel as ResetIcon} from "@material-ui/icons";

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


export default function AddUserFormDialog(props) {

    const classes = useStyles();

    return (
        <div>
            <Dialog open={props.open} onClose={props.onClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth={'md'}
                    keepMounted onExit={props.onClose}>
                <DialogTitle id="form-dialog-title">Add New User</DialogTitle>
                <DialogContent>

                    <form noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        props.saveNewUser(e);
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
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Last Name"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="name" required
                                        name='last_name'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            id="standard-secondary"
                                            label="Is Admin" color="primary"
                                            name='is_admin' required
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
                                        name='email'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        label="Telephone" type={'tel'}
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="tel" required
                                        name='telephone'
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
                                        name='postal_address'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        label="Picture"
                                        inputProps={{style: textFieldStyle.resize}}
                                        color="primary"
                                        fullWidth autoComplete="i_price"
                                        name='picture'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button fullWidth type='submit'
                                            style={textFieldStyle.resize}
                                            color='primary' variant="contained"
                                            startIcon={<ResetIcon/>}>Add</Button>
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
