import React from 'react'
import {useRoutes} from "./routes"
import {BrowserRouter} from "react-router-dom"
import {useAuth} from "./hooks/auth.hook"
import {AuthContext} from "./context/AuthContext"
import CopyrightComponent from "./components/CopyrightComponent";
import NavBar from "./components/NavBar";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },

}));

function App() {
    const {login, logout, token, userId} = useAuth()
    const isAuthenticated =!!token
    console.log(token)
    const routes = useRoutes(isAuthenticated)
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <AuthContext.Provider value={{
            login, logout, token, userId, isAuthenticated
        }}>
            <BrowserRouter>
                {<NavBar/>}
                <div>
                    {routes}
                </div>
            </BrowserRouter>
            <CopyrightComponent/>
        </AuthContext.Provider>
        </div>
    )
}

export default App
