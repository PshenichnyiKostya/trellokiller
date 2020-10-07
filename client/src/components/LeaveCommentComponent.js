import React, {useContext, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        minWidth: 300,
        width: '100%',

    },
}))

export default function LeaveCommentComponent({cardId}) {
    const classes = useStyles();
    const {request, loading, error, clearError} = useHttp()
    const [text, setText] = useState('')
    const [references, setReferences] = useState('')
    const {token} = useContext(AuthContext)

    async function leaveCommentHandle() {
        try {
            await request('/api/comment/', 'POST', {text, references, cardId}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
        } catch (e) {

        }
    }

    function handleCloseError() {
        clearError()
    }

    function handleText(e) {
        setText(e.target.value)
    }

    function handleReferences(e) {
        setReferences(e.target.value)
    }

    return (
        <div className={classes.root}>
            <TextField
                id="filled-full-width"
                label="Comment"
                name="text"
                placeholder="Leave your comment..."
                margin="normal"
                style={{width: '130px'}}
                onChange={handleText}
                InputLabelProps={{
                    shrink: true,
                }}
                variant="filled"
            />
            <TextField
                id="filled-full-width"
                label="References"
                name="references"
                placeholder="Refer to users"
                helperText="You need to write here user ids separated by commas"
                margin="normal"
                style={{width: '130px'}}
                onChange={handleReferences}
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
                onClick={leaveCommentHandle}
                disabled={loading}
            >
                Leave comment
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>

    );
}