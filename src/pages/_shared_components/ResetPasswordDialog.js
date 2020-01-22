import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    Grid, makeStyles
} from "@material-ui/core";
import Widget from "../../components/Widget";
import {textFieldStyle, textFieldStyle30} from "../../_utils/inlineStyles";
import {Save as SaveIcon} from "@material-ui/icons";
// import Slide from "@material-ui/core/Slide";
import {CHANGE_PASSWORD, fetcher, getUser} from "../../_utils/fetcher";


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


export default function ResetPasswordFormDialog(props) {

    const classes = useStyles();

    // const Transition = React.forwardRef(function Transition(props, ref) {
    //     return <Slide direction="up" ref={ref} {...props} />;
    // });

    // const checkOldPassword = async (pass) => {
    //     const user = await getUser(localStorage.getItem('token'));
    //
    //     try {
    //         let res = await fetcher({
    //             query: NO_ADMIN_RESET_PASSWORD,
    //             variables: {user_id: user.user_id, pass}
    //         });
    //         console.log(res);
    //         // if (res)
    //     } catch (e) {
    //         console.log(e);
    //     }
    //     return res.data.validPass;
    // };

    const resetPassword = async (e) => {
        const old = e.target.old_pass.value;
        const newP = e.target.new_pass.value;
        const conf = e.target.confirm.value;

        // console.log('old, newP, confirm', old, newP, conf);

        if (newP.length < 4) {
            alert("Your password need to be 4 or more characters");
            return;
        }
        if (newP !== conf) {
            alert("Your new password and confirm password do not match");
            return;
        }

        // check if old password is right
        const user = await getUser(localStorage.getItem('token'));

        try {
            let res = await fetcher({
                query: CHANGE_PASSWORD,
                variables: {user_id: user.user_id, old, newP, conf}
            });
            // console.log(res);

            if (res && res.errors) {
                alert(res.errors.message);
                return;
            }

            (res.data.changePassword) ? alert("Password changed") : alert("Password NOT changed.")
        } catch (e) {
            console.log(e);
        }
        props.onClose();
    };

    return (
        <div>

            <Dialog open={props.open} onClose={props.onClose}
                    aria-labelledby="form-dialog-title"
                    maxWidth={'md'}
                    keepMounted
                    onExit={props.onClose}>
                <DialogTitle id="form-dialog-title">Change Password</DialogTitle>
                <DialogContent>
                    <form className={classes.form} noValidate
                          autoComplete="off"
                          onSubmit={(e) => {
                              e.preventDefault();
                              resetPassword(e);
                          }}>
                        <Widget disableWidgetMenu>
                            <Grid container spacing={3} justify="space-around"
                                // className={classes.dashedBorder}
                            >
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle30.resize,
                                        }}
                                        fullWidth id="standard-second"
                                        label="Old Password"
                                        color="primary"
                                        type={'password'}
                                        // onChange={this.handleChange}
                                        // defaultValue={data.pic}
                                        name='old_pass'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle30.resize,
                                        }}
                                        fullWidth id="standard-second"
                                        label="New Password"
                                        color="primary"
                                        type={'password'}
                                        // onChange={this.handleChange}
                                        // defaultValue={data.pic}
                                        name='new_pass'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        InputProps={{
                                            style: textFieldStyle30.resize,
                                        }}
                                        fullWidth id="standard-second"
                                        label="Confirm"
                                        color="secondary"
                                        type={'password'}
                                        // onChange={this.handleChange}
                                        // defaultValue={data.pic}
                                        name='confirm'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button fullWidth type='submit'
                                            style={textFieldStyle.resize}
                                            color='secondary' variant="contained"
                                            startIcon={<SaveIcon/>}>Reset Password</Button>
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