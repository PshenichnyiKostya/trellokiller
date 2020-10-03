import React, {useContext, useEffect, useState} from "react"
import {useHttp} from "../hooks/http.hook";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {AuthContext} from "../context/AuthContext";
import CardContent from "@material-ui/core/CardContent";
import AddUsersToBoardComponent from "../components/AddUsersToBoardComponent";
import CardsComponent from "../components/CardsComponent";
import CreateCardComponent from "../components/CreateCardComponent";
import UpdateBoardComponent from "../components/UpdateBoardComponent";
import DeleteCardComponent from "../components/DeleteCardComponent";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}))


export const BoardPage = ({...props}) => {
    const [board, setBoard] = useState(null)
    const [users, setUsers] = useState([])
    const {request, loading} = useHttp()
    const {token, userId} = useContext(AuthContext)

    const classes = useStyles()
    useEffect(() => {
        const func = async () => {
            const {id} = props.match.params
            try {
                const data = await request(`/api/board/${id}`, 'GET', undefined, {
                    'Authorization':
                        `JWT ${token}`,
                    'Context-Type': 'Application/json'
                })
                return data
            } catch (e) {
                return e.message
            }
        }

        func().then(r => {
            setBoard(r.data)
            setUsers(r.data.team)
        })

    }, [props.match.params, request, token])

    return (
        <div>
            {!loading && board ? <div>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <div className={classes.paper}>

                            <Toolbar>
                                <Typography variant="h1" color="inherit" noWrap>
                                    {board.name}
                                </Typography>
                            </Toolbar>
                            {userId === board.admin._id ?
                                <div>
                                    <AddUsersToBoardComponent boardId={board._id} boardName={board.name}/>
                                    <div className={classes.paper}>
                                        <UpdateBoardComponent boardId={board._id}/>
                                    </div>
                                </div>
                                : undefined}
                        </div>
                        <div className={classes.paper}>
                            <CreateCardComponent boardId={board._id}/>
                        </div>
                    </Container>
                    <CardContent>
                        <Typography variant='h5'>
                            Admin: {board?.admin?.email}
                        </Typography>
                    </CardContent>
                    {users?.length ? users.map(user =>
                            <li key={user._id}>
                                <CardContent>
                                    <Typography variant='h5'>
                                        {user.email}
                                    </Typography>
                                </CardContent>
                            </li>
                        ) :
                        <div className={classes.paper}>
                            <CssBaseline/>
                            <Toolbar>
                                <Typography variant="h5" color="inherit" noWrap>
                                    No users here
                                </Typography>
                            </Toolbar>
                        </div>}
                    <CardsComponent boardId={board._id}/>
                </div>
                : null}
        </div>
    )
}