import React, {Component} from 'react';
import LoginDropDown from "./LoginDropDown";
import {fetcher, LOGIN_QUERY, LOGGED_USER, USERS} from "../../_utils/fetcher";
import {
    Avatar, Button, CssBaseline, TextField,// FormControlLabel, Checkbox,
    Link, Grid, Box, Typography, Container
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {withStyles} from "@material-ui/core/styles";
import {loginUser, /*useUserDispatch*/} from "../../context/UserContext";
import {textFieldStyle} from "../../_utils/inlineStyles";
import {userService} from "../../_utils/user.service";

const Copyright = () =>
    (<Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" >
                Deloop Artisans Ltd.
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );

const useStyles = (theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


class MyLoginPage extends Component {
    // static contextType = useUserDispatch;
    // userDispatch = useUserDispatch();
    constructor(props) {
        super(props);
        // console.log('props', props);

        this.userDispatch = this.props.cont;

        // console.log('this.userDispatch', this.userDispatch);

        userService.logout();

        this.state = {
            registerUsername: '',
            registerEmail: 'noadmin@yahoo.com',
            notAdminPassword: '1234',
            registerPassword: '',
            registerAgree: false,
            submitted: false,
            isLoading: false,
            error: '',
            users: []
        };

        // don't have to do this no more because of ECMAScript 6 arrow functions
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    componentDidMount() {
        this.fetchUsers()
    }

    fetchUsers = async () => {
        try {
            let res = await fetcher({
                query: USERS,
            });
            let users = res.data.allUsersNoAdmin;

            this.setState({users});
        } catch (err) {
            console.log(err);
        }
    };

    handleDropdownChange(e) {
        const {value} = e.target;
        this.setState({registerEmail: value})
    };

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    tokenSuccess = (token) => {
        fetcher.use(({request, options}, next) => {
            options.headers = {
                "authorization": token
            };
            next();
        });
        fetcher({
            query: LOGGED_USER,
        }).then(res => {
                localStorage.setItem('username', res.data.me.first_name + " " + res.data.me.last_name.charAt(0) + '.');
                localStorage.setItem('pic', res.data.me.pic);

                this.setState({loggedIn: true});

                loginUser(
                    this.userDispatch,
                    this.state.registerEmail,
                    this.state.registerPassword,
                    this.props.history,
                    this.state.isLoading,
                    this.state.error,
                    res.data.me
                );
            },
            error => this.setState({error, loading: false})
        );
    };

    handleSubmit = async (e) => {

        e.preventDefault();

        this.setState({submitted: true});
        const {registerEmail, registerPassword, /*registerAgree*/} = this.state;

        // stop here if form is invalid
        if (!(registerEmail && registerPassword /* && registerAgree*/)) {
            return;
        }
        this.setState({loading: true});

        await fetcher({
            query: LOGIN_QUERY,
            variables: {email: this.state.registerEmail, password: this.state.registerPassword},
        }).then(res => {
                if (res.data != null) {
                    const token = res.data.login;
                    localStorage.setItem('token', token);
                    localStorage.setItem('id_token', '1');
                    // localStorage.setItem('username', token);

                    this.tokenSuccess(token);

                } else {
                    this.setState({loading: false, error: res.errors[0].message});
                    console.log(this.state.error);
                }
            },
            error => {
                this.setState({error, loading: false});
                console.log('Error log', error)
            });

    };

    render() {
        const {classes} = this.props;
        const {registerEmail, registerPassword} = this.state;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign In to <strong>POS</strong>
                        <br/>user: <strong>Not Admin</strong>
                        <br/>password: <strong>1234</strong>
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.handleSubmit}>

                        <LoginDropDown
                            users={this.state.users}
                            registerEmail={this.state.registerEmail}
                            handleDropdownChange={this.handleDropdownChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            type="email"
                            value={registerEmail} onChange={this.handleChange}
                            label="Email Address"
                            name="registerEmail"
                            autoComplete="email"
                            autoFocus
                            disabled
                            inputProps={{
                                className: classes.text,
                                style: textFieldStyle.resize
                            }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="registerPassword"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={registerPassword} onChange={this.handleChange}
                            inputProps={{
                                className: classes.text,
                                style: textFieldStyle.resize
                            }}
                        />

                        <Button
                            style={textFieldStyle.resize}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={
                                registerPassword.length === 0 || registerEmail.length === 0
                            }
                        >
                            Log In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright/>
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(MyLoginPage);
