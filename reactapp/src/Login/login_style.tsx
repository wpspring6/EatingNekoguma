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
      width: "100px",
      margin: "auto",
      paddingTop: "50px",
      "& > *": {
        paddingTop:"20px",
        paddingBottom:"20px",
      },
    },
  }));

  export default LoginStyle;