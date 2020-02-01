import {makeStyles} from "@material-ui/styles";

export default makeStyles(theme => ({
    root: {
        display: "flex",
        maxWidth: "100vw",
        overflowX: "hidden",
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: `calc(100vw - 240px)`,
        minHeight: "100vh",
    },

    salesContent: { // not working
        height: "83vh",
        display: "flex",
    },
    content3: {
        flexGrow: 1,
        padding: theme.spacing(3),
        width: `calc(100vw - 740px)`,
        minHeight: "100vh",
    },

    contentShift: {
        width: `calc(100vw - ${240 + theme.spacing(6)}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    fakeToolbar: {
        ...theme.mixins.toolbar,
    },
    // flexSection: {
    //     flexGrow: 1,
    //     display: 'flex',
    //     flexDirection: 'column',
    //     minHeight: 0,
    // },
    // flexColScroll: {
    //     flexGrow: 1,
    //     overflow: 'auto',
    //     minHeight: '100%',
    // },
    // flexNoShrink: {
    //     flexShrink: 0,
    // }
}));
