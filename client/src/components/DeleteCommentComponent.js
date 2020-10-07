import React, {useContext} from "react";
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


export default function DeleteCommentComponent({commentId}) {
    const {request, loading, error, clearError} = useHttp()
    const classes = useStyles()
    const {token} = useContext(AuthContext)


    function handleCloseError() {
        clearError()
    }

    async function deleteCommentHandler() {
        try {
            await request(`/api/comment/${commentId}`, 'DELETE', undefined, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
        } catch (e) {

        }
    }

    return (
        <div className={classes.paper}>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{width: '100px'}}
                onClick={deleteCommentHandler}
                disabled={loading}
            >
                Delete comment
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    )
}

