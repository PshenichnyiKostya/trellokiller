import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useContext, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";


const AddUsersToBoardComponent = ({boardId, boardName}) => {
    const [users, setUsers] = useState('')
    const {request, loading, error, clearError} = useHttp()
    const {token} = useContext(AuthContext)

    function handleUsers(e) {
        setUsers(e.target.value)
    }

    async function addUsersHandle() {
        try {
            const data = await request(`/api/board/${boardId}`, 'PATCH', {name: boardName, usersId: users}, {
                'Authorization':
                    `JWT ${token}`,
                'Context-Type': 'Application/json'
            })
            return data
        } catch (e) {
            return e.message
        }
    }

    function handleCloseError() {
        clearError()
    }

    return (
        <div>
            <TextField
                id="filled-full-width"
                label="Users emails"
                name="users"
                onChange={handleUsers}
                helperText="You need to write here user ids separated by commas"
                margin="normal"
                style={{marginLeft: '100px'}}
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
                onClick={addUsersHandle}
                disabled={loading}
            >
                Add users to board
            </Button>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} severity="warning">
                    {error}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AddUsersToBoardComponent