import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = (theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

class ImageAvatar extends Component {
    render()
    {
        return (
            <div className={useStyles.root}>
                <Avatar alt="Remy Sharp" src="/images/avatars/1.jpg" className={useStyles.small}/>
                <Avatar alt="Remy Sharp" src="/images/avatars/1.jpg"/>
                <Avatar alt="Remy Sharp" src="/images/avatars/1.jpg" className={useStyles.large}/>
            </div>
        );
    }
}

export default withStyles(useStyles, {withTheme: true})(ImageAvatar);
