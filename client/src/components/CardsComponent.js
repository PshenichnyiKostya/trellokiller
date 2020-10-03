import React, {useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {fade, makeStyles} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import LeaveCommentComponent from "./LeaveCommentComponent";
import UpdateCardComponent from "./UpdateCardComponent";
import DeleteCardComponent from "./DeleteCardComponent";
import UpdateCommentComponent from "./UpdateCommentComponent";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 300,
        width: '100%',
        outline: '2px solid #000',
    },
    card: {
        width: '150px',
        minHeight: '100px',
        outline: '2px solid #000',
        marginTop: '15px',
    },
    comment: {
        outline: '2px solid #000',
        marginTop: '15px',
        padding: '5px'
    },
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}))

const CardsComponent = ({boardId}) => {
    const classes = useStyles();
    const [cards, setCards] = useState([])
    const {request, loading, error, clearError} = useHttp()
    const {token, userId} = useContext(AuthContext)
    const [name, setName] = useState('')


    useEffect(() => {
        const func = async function () {
            try {
                const data = await request(`/api/card/?boardId=${boardId}&name=${name}`, 'GET', undefined, {
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
            setCards(r.data)
        })

    }, [request, name])

    function handleCloseError() {
        clearError()
    }

    function handleName(e) {
        setName(e.target.value)
    }


    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
        const day = date.getDate();
        const month = MONTH_NAMES[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        if (prefomattedDate) {
            return `${prefomattedDate} at ${hours}:${minutes}`;
        }

        if (hideYear) {
            return `${day} ${month} at ${hours}:${minutes}`;
        }

        return `${day} ${month} ${year} at ${hours}:${minutes}`;
    }

    function timeAgo(dateParam) {
        if (!dateParam) {
            return null;
        }

        const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
        const DAY_IN_MS = 86400000;
        const today = new Date();
        const yesterday = new Date(today - DAY_IN_MS);
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const isToday = today.toDateString() === date.toDateString();
        const isYesterday = yesterday.toDateString() === date.toDateString();
        const isThisYear = today.getFullYear() === date.getFullYear();

        if (seconds < 5) {
            return 'now';
        } else if (seconds < 60) {
            return `${seconds} second ago`;
        } else if (seconds < 90) {
            return 'minute ago';
        } else if (minutes < 60) {
            if (minutes % 10 === 2 || minutes % 10 === 3 || minutes % 10 === 4)
                return `${minutes} minutes ago`;
            if (minutes % 10 === 1) {
                return `${minutes} minute ago`;
            }
            return `${minutes} minutes ago`;
        } else if (isToday) {
            return getFormattedDate(date, 'today');
        } else if (isYesterday) {
            return getFormattedDate(date, 'yestaday');
        } else if (isThisYear) {
            return getFormattedDate(date, false, true);
        }

        return getFormattedDate(date);
    }

    return (
        <div>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon/>
                </div>
                <InputBase
                    placeholder="Search cards by name..."
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    onChange={handleName}
                />
            </div>
            {!cards?.length && !loading ? <div className={classes.paper}>
                    <CssBaseline/>
                    <Toolbar>
                        <Typography variant="h5" color="inherit" noWrap>
                            No card here
                        </Typography>
                    </Toolbar>
                </div> :
                <div className={classes.root}>
                    {cards.map(card =>
                        <li key={card._id}>
                            <UpdateCardComponent cardId={card._id} boardId={boardId}/>
                            <DeleteCardComponent style={{marginTop: '30px'}} boardId={boardId} cardId={card._id}/>
                            <CardContent className={classes.card}>
                                <Typography variant='h5'>
                                    {card.name}
                                </Typography>
                                <Typography variant='h7'>
                                    Status: {card.status}
                                </Typography>
                                <br/>
                                <br/>
                                {card?.comments?.length ? card?.comments?.map(comment =>
                                    <div>
                                        <li key={comment._id}>
                                            <div className={classes.comment}>
                                                <Typography variant='h10'>
                                                    {timeAgo(comment.timestamp)}
                                                </Typography>
                                                <br/>
                                                <Typography variant='h7'>
                                                    {comment.user.email}
                                                </Typography>
                                                <Typography variant='h5'>
                                                    {comment.text}
                                                </Typography>
                                                <Typography variant='h'>
                                                    References:
                                                </Typography>
                                                {comment.references?.length ? comment.references.map(user =>
                                                    <li key={user._id}>
                                                        <Typography variant='h8'>
                                                            {user.email}
                                                        </Typography>
                                                    </li>
                                                ) : undefined}
                                                <br/>
                                                <br/>
                                                {comment.user._id === userId ?
                                                    <UpdateCommentComponent commentId={comment._id}/> : undefined}
                                            </div>
                                        </li>
                                    </div>
                                ) : undefined}

                            </CardContent>
                            <LeaveCommentComponent cardId={card._id}/>
                        </li>)}
                </div>}

        </div>
    )
}

export default CardsComponent