import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    FormControl, Grid, InputLabel, makeStyles, MenuItem, Select
} from "@material-ui/core";
import Widget from "../../../components/Widget";
import {textFieldStyle} from "../../../_utils/inlineStyles";
import {Save as SaveIcon} from "@material-ui/icons";

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


    return (
        <div>

            <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title"
                    maxWidth={'md'} 
                    keepMounted onExit={props.onClose}>
                <DialogTitle id="form-dialog-title">Add New Category</DialogTitle>
                <DialogContent>

                    <form className={classes.form} noValidate autoComplete="off" onSubmit={(e) => {
                        e.preventDefault();
                        props.saveNewItem(e);
                    }}>

                        <Widget disableWidgetMenu>
                            <Grid container spacing={1} justify="space-around">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle.resize,
                                        }}
                                        required label="Name" color="primary" fullWidth
                                        autoComplete="c_name" name='category_name'
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
