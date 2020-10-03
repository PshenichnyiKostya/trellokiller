import React, {useContext} from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export default function ({boardId,cardId}) {

    const {request, loading, error, clearError} = useHttp()
    const {token} = useContext(AuthContext)

    async function deleteBoardHandler() {
        try {
            await request(`/api/card/${cardId}`, 'DELETE', {boardId}, {
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

    return (
        <div>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{width: '40ch'}}
                onClick={deleteBoardHandler}
                disabled={loading}
            >
                Delete card
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    )
}