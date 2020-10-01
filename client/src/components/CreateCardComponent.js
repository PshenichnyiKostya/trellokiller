import React, {useContext, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";



export default function CreateCardComponent({boardId}) {
    const {request, loading, error, clearError} = useHttp()
    const [name, setName] = useState('')
    const {token} = useContext(AuthContext)

    async function createCardHandler() {
        try {
            const data = await request('/api/card/', 'POST', {name, boardId}, {
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


    function handleName(e) {
        setName(e.target.value)
    }

    return (
        <div>
            <TextField
                id="filled-full-width"
                label="Card name"
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
                onClick={createCardHandler}
                disabled={loading}
            >
                Create card
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>

    );
}