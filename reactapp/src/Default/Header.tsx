import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, NavbarBrand, NavItem } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import "./header.css"

function clearCookie(){
axios
  .get(
      'http://localhost:1323/cookie/delete',
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        withCredentials: true
      }
  )
  .then(results => {

  }
  )
  .catch(
      error => {
        return null;
      }
  );
}

const Header = () =>{
    const location = useLocation();
    const menue = () => {
        if(location.pathname != '/login'){
            return(
                <nav>
                    <ul>
                        <li>
                            <a href="/top">トップ</a>
                        </li>
                        <li>
                            <a href="/user">店舗登録</a>
                        </li>
                        <a  onClick={async () => {
                            try {
                                clearCookie();
                            } catch (error) {
                                alert(error.message);
                            }
                            }}
                            href="/login"
                            className="logout">
                                ログアウト
                        </a>
                    </ul>
                </nav>
            );
        } else {
            return(
                <div></div>
            );
        }
    }
    
    return(
        <div>
            <header>
                <big>コーヒー図鑑</big>
                {menue()}
            </header>
        </div>
    );
};


export default Header;