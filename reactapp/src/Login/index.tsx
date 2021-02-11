import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Avatar,
  Input,
  InputLabel,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { useCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import { blue, red } from "@material-ui/core/colors";

const LoginStyle = makeStyles((theme) => ({
  root: {
    width: "40%",
    margin: "auto",
    paddingTop: "50px",
    "& > *": {
      paddingTop:"20px",
      paddingBottom:"20px",
    },

  },
}));


const Login = (props: any) => {
  // ここではuseStateというHooksの機能を利用している
  // フォームに入力された値を保持する変数を宣言する形
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const classes = LoginStyle();

  // useEffectもHooksの機能。ここではページがロードされたタイミングで
  // ログイン状態かどうかを判定するイベントを発動する
  useEffect(() => {
  }, []);

  function handleSubmit() {
    let params = new URLSearchParams();
    params.append('user_email', email);
    params.append('user_password', password);
    axios
    .post(
        'http://localhost:1323/users/select',
        params,
        {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          withCredentials: true
        }
    )
    .then(results => {
      console.log(results.data);
      if(results.data != 0 ){
          props.history.push('/top');
      }else{
          alert("IDもしくはパスワードが間違っています。");
      }
      }
    )
    .catch(
        error => {
          console.log("jfowejaofjeo");
          console.log(error);
        }
    );
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Paper elevation={3}>
          <Avatar style={{margin: "auto"}} />
          <form style={{width:"80%", margin:"auto"}}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">メールアドレス</InputLabel>
              <Input id="email" name="username" onChange={ (event: React.ChangeEvent<HTMLInputElement>) => { setEmail(event.target.value) }} autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">パスワード</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                onChange={ (event: React.ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value) }}
                autoComplete="current-password"
              />
            </FormControl>
            <Button
              fullWidth
              color="primary"
              style={{marginTop: 50, backgroundColor:"blue", color:"white", fontSize:"15px"}}
              onClick={handleSubmit}
            >
              ログイン
            </Button>
          </form>
        </Paper>
      </div>
    </React.Fragment>
  );
};


export default Login;