import React, {useContext, useEffect, useState} from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";
import {Link} from 'react-router-dom'
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
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
}));

export const BoardsPage = () => {
    const classes = useStyles();
    const [myBoardsFlag, setMyBoardsFlag] = useState(false)
    const [name, setName] = useState('')
    const {loading, error, request, clearError} = useHttp()
    const [boards, setBoards] = useState([])
    const {token} = useContext(AuthContext)

    async function handleChangeFlag(event) {
        setMyBoardsFlag(event.target.checked)
    }

    useEffect(() => {
        const func = async () => {
            let data
            if (myBoardsFlag) {
                data = await request(`/api/board/my?name=${name}`, 'GET', undefined, {
                    'Authorization':
                        `JWT ${token}`,
                    'Context-Type': 'Application/json'
                })
            } else {
                data = await request(`/api/board?name=${name}`, 'GET', undefined, {
                    'Authorization':
                        `JWT ${token}`,
                    'Context-Type': 'Application/json'
                })
            }
            return data
        }
        func().then(data => {
            setBoards(data.data)
        })
    }, [request, myBoardsFlag,name])

    function handleName(e) {
        setName(e.target.value)
    }

    return (
        <Card className={classes.root}>
            <FormGroup>
                <FormControlLabel
                    control={<Switch checked={myBoardsFlag} onChange={handleChangeFlag}/>}
                    label={myBoardsFlag ? 'My boards' : 'All boards'}
                />
            </FormGroup>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon/>
                </div>
                <InputBase
                    placeholder="Search by name..."
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    onChange={handleName}
                />
            </div>

            {loading ? null :
                boards.map(board =>
                    <li key={board._id}>
                        <CardContent>
                            <Typography variant='h5'>
                                {board.name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">
                                <Link to={`/board/${board._id}`}>See more</Link>
                            </Button>
                        </CardActions>
                    </li>
                )
            }
        </Card>
    );
}