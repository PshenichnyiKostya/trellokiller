import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import React, {useContext} from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from '@material-ui/core/styles';
import {AuthContext} from "../context/AuthContext";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function NavBar() {
    const classes = useStyles();

    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = (e) => {
        e.preventDefault()
        auth.logout()
        history.push('/login')
    }
    const loginHandler = (e) => {
        e.preventDefault()
        history.push('/login')
    }
    const onRegisterPageHandler = (e) => {
        e.preventDefault()
        history.push('/registration')
    }

    function createBoardHandler(e) {
        e.preventDefault()
        history.push('/create/board')
    }

    function handleBoards(e) {
        e.preventDefault()
        history.push('/boards')
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Trello
                </Typography>
                {auth.isAuthenticated ? <Button color="inherit" onClick={handleBoards}>Boards</Button> : undefined}
                {auth.isAuthenticated ? <Button color="inherit" onClick={createBoardHandler}>Create board</Button> : undefined}
                {!auth.isAuthenticated ? <Button color="inherit" onClick={loginHandler}>Sing In</Button> : undefined}
                {!auth.isAuthenticated ? <Button color="inherit" onClick={onRegisterPageHandler}>Sing Up</Button> : undefined}
                {auth.isAuthenticated ? <Button color="inherit" onClick={logoutHandler}>Log Out</Button> : undefined}
            </Toolbar>
        </AppBar>
    )
}