import React, {useContext, useState} from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {useHttp} from "../hooks/http.hook";
import {makeStyles} from "@material-ui/core/styles";
import {AuthContext} from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
}));


export default function UpdateCardComponent({cardId,boardId}) {
    const {request, loading, error, clearError} = useHttp()
    const classes = useStyles()
    const [name, setName] = useState('')
    const [status, setStatus] = useState('')
    const {token} = useContext(AuthContext)

    function handleName(e) {
        setName(e.target.value)
    }

    function handleStatus(e) {
        setStatus(e.target.value)
    }

    function handleCloseError() {
        clearError()
    }

    async function updateCardHandler() {
        try {
            const data = await request(`/api/card/${cardId}`, 'PATCH', {name,status,boardId}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
        } catch (e) {

        }
    }

    return (
        <div className={classes.paper}>
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
            <TextField
                id="filled-full-width"
                label="Status"
                name="status"
                placeholder="todo,inprogress or done"
                onChange={handleStatus}
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
                onClick={updateCardHandler}
                disabled={loading}
            >
                Update card
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    )
}

