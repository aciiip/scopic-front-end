import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {createTheme, MuiThemeProvider} from "@material-ui/core";
import {red} from "@material-ui/core/colors";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1e90ff',
        },
        secondary: {
            main: '#1f874f',
        },
        error: {
            main: red.A400,
        }
    },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);