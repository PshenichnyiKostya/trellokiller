import React, {useContext, useState} from "react"
import {makeStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Container from "@material-ui/core/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import {useHttp} from "../hooks/http.hook"
import {useHistory} from "react-router-dom"
import {Alert} from "@material-ui/lab"
import Snackbar from "@material-ui/core/Snackbar"
import {AuthContext} from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));


export const CreateBoardPage = () => {
    const history = useHistory()
    const classes = useStyles();
    const [name, setName] = useState('')
    const {request, loading, error, clearError} = useHttp()
    const {token} = useContext(AuthContext)
    const handleName = (event) => {
        setName(event.target.value)
    }

    async function createBoardHandler() {
        try {
            const data = await request('/api/board/', 'POST', {name}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
            history.push(`/board/${data.data}`)
        } catch (e) {

        }
    }

    function handleCloseError() {
        clearError()
    }

    return (
        <div className={classes.paper}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <Toolbar>
                        <Typography variant="h2" color="inherit" noWrap>
                            Create board
                        </Typography>
                    </Toolbar>
                </div>
            </Container>
            <TextField
                id="filled-full-width"
                label="Name"
                name="name"
                placeholder="Min length 5 symbols"
                onChange={handleName}
                margin="normal"
                style={{width: '40ch'}}
                InputLabelProps={{
                    shrink: true,
                }}
                variant="filled"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{width: '40ch'}}
                onClick={createBoardHandler}
                disabled={loading}
            >
                Create
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
}