import React, {useContext, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";



export default function UpdateBoardComponent({boardId}) {
    const {request, loading, error, clearError} = useHttp()
    const [name, setName] = useState('')
    const {token} = useContext(AuthContext)

    function handleName(e) {
        setName(e.target.value)
    }

    function handleCloseError() {
        clearError()
    }

    async function updateBoardHandler() {
        try {
            const data = await request(`/api/board/${boardId}`, 'PATCH', {name}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
        } catch (e) {

        }
    }

    return (
        <div>
            <TextField
                id="filled-full-width"
                label="Board name"
                name="name"
                placeholder="Min length 5 symbols"
                margin="normal"
                style={{marginLeft: '100px'}}
                onChange={handleName}
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
                onClick={updateBoardHandler}
                disabled={loading}
            >
                Update board name
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    )
}

