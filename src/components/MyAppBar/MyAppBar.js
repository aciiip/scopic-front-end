import React, {Component} from "react";
import {AppBar, Button, Menu, MenuItem, Toolbar, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import axios from "axios";

const useStyles = theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        textDecoration: 'none',
        color: "white"
    },
});

class MyAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            menuOpen: false,
            anchorEl: null
        }
    }
    componentDidMount() {
        axios.get('http://localhost:8000/api/me', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            this.setState({
                user: response.data.data.user
            });
        });
    }
    onUserClicked = (event) => {
        this.setState({
            menuOpen: true,
            anchorEl: event.currentTarget
        });
    }
    onMenuClose = () => {
        this.setState({
            menuOpen: false,
            anchorEl: null
        })
    }
    logOut = () => {
        this.onMenuClose();
        localStorage.removeItem('token');
        window.location = '/login'
    }
    render() {
        const { classes } = this.props
        return (
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" className={classes.title} component={Link} to={'/'}>
                        Scopic
                    </Typography>
                    {this.state.user ? (
                        <>
                            <Button color={'inherit'} variant={'outlined'} onClick={this.onUserClicked}>
                                {this.state.user.name}
                            </Button>
                            <Menu open={this.state.menuOpen} anchorEl={this.state.anchorEl} onClose={this.onMenuClose}>
                                <MenuItem component={Link} to={'/setting'}>Setting</MenuItem>
                                <MenuItem onClick={this.logOut}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to={"/login"}>Login</Button>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(useStyles)(MyAppBar)