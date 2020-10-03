import React, {useContext, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {useHttp} from "../hooks/http.hook";
import {makeStyles} from "@material-ui/core/styles";
import {AuthContext} from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: '15px',
        padding: '5px',
    },
}));


export default function UpdateCommentComponent({commentId}) {
    const {request, loading, error, clearError} = useHttp()
    const classes = useStyles()
    const [text, setText] = useState('')
    const {token} = useContext(AuthContext)

    function handleText(e) {
        setText(e.target.value)
    }

    function handleCloseError() {
        clearError()
    }

    async function updateCommentHandler() {
        try {
            const data = await request(`/api/comment/${commentId}`, 'PATCH', {text}, {
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
                label="Text"
                name="text"
                onChange={handleText}
                margin="normal"
                style={{width: '100px'}}
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
                style={{width: '100px'}}
                onClick={updateCommentHandler}
                disabled={loading}
            >
                Update comment
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    )
}

