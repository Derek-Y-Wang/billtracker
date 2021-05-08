import React, {useContext, useEffect} from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
// components
import Layout from "./components/Layout";
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Forgot from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Verification from './pages/Verification';
import {makeStyles} from "@material-ui/core";
import {AuthContext} from './contexts/AuthContext';

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: "lightgray",
        float: "bottom",
        padding: "20px",
    },
}));

export default function App() {
    // global
    // const classes = useStyles();
    const {isAuth, updateAuth, updateToken, token} = useContext(AuthContext);

    const checkAuthenticated = () => {
        fetch('http://localhost:8000/api/user/verify', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                jwt_token: localStorage.token
            }
        }).then(response => response.json()).then(data => {
            data === true ? updateAuth(true) : updateAuth(false);
        }).catch(err => {
            console.log("Error");
        });
    }
    useEffect(() => {
        //checkAuthenticated();
    }, []);

    return (
        <div className="App">
            <Switch>
                <Route path="/" render={() => !isAuth ? (<Landing/>) : (<Redirect to="/app"/>)} exact/>
                <Route path="/login" render={() => !isAuth ? (<Login/>) : (<Redirect to="/app"/>)} exact/>
                <Route path="/app" component={Layout}/>
                <Route path="/signup" render={() => !isAuth ? (<SignUp/>) : (<Redirect to="/app"/>)}/>
                <Route path="/forgot-password" render={() => !isAuth ? (<Forgot/>) : (<Redirect to="/app"/>)}/>
                <Route exact path="/resetpassword/:token" render={(props) => <ResetPassword {...props}/>}/>
                <Route exact path="/verification/:token" render={(props) => <Verification {...props}/>}/>
                <Route path='*'>
                    <div>Not Found</div>
                </Route>
            </Switch>
            {/*<footer className={classes.footer}>*/}
            {/*    {Copyright()}*/}
            {/*</footer>*/}
        </div>
    );
}
