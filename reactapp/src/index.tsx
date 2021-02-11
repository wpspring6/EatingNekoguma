import React, {useState} from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Redirect } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { Route, Switch } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Shop from "./Shop";
import Header from "./Default/Header";
import axios from 'axios';
import { render } from "@testing-library/react";
import SiteTop from "./Site/siteTop";


const LoginCheck = () => {
  axios
  .get(
      'http://localhost:1323/cookie/get',
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true
      }
  )
  .then(results => {
    if(results.data == null){
      logout();
    }
  }
  )
  .catch(
      error => {
        return null;
      }
  );
}
const logout = () => {
  render( 
    <BrowserRouter>
    <Redirect to={{pathname: '/',}} />
    </BrowserRouter>
  );
}

ReactDOM.render(
  <BrowserRouter>
    {LoginCheck()}
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route path="/top"  composnent={Home} >
        <Home/>
      </Route>
      <Route path="/user" composnent={Shop} >
        <Shop/>
      </Route>
      <Route path="/" composnent={SiteTop} >
        <SiteTop/>
      </Route>
    </Switch>
  </BrowserRouter>
  ,
  document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
