import React from "react"
import {Redirect, Route, Switch} from "react-router-dom";
import {BoardsPage} from "./pages/BoardsPage";
import {AuthPage} from "./pages/AuthPage";
import {BoardPage} from "./pages/BoardPage";
import {RegisterPage} from "./pages/RegisterPage";
import {CreateBoardPage} from "./pages/CreateBoardPage";
import {WelcomePage} from "./pages/WelcomePage";

export const useRoutes = (isAuthenticated) => {

    return (
        <Switch>
            <Route path="/login" component={AuthPage}/>
            <Route path="/registration" component={RegisterPage}/>

            {isAuthenticated ?
                <Route path='/create/board' component={CreateBoardPage}/>
                : null
            }
            {isAuthenticated ?
                <Route path='/board/:id' component={BoardPage}/>
                : null
            }
            {isAuthenticated ?
                <Route path='/boards' component={BoardsPage}/>
                : null
            }
            <Route path="/" component={WelcomePage}/>
            <Route render={() => <Redirect to='/'/>}/>
        </Switch>
    )
}