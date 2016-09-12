import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Main from './Main';
import Login from './Login';


injectTapEventPlugin();
const LoginPage = () => (
  <MuiThemeProvider>
    <Login />
  </MuiThemeProvider>
);
const MainPage = () => (
  <MuiThemeProvider>
    <Main />
  </MuiThemeProvider>
);

ReactDOM.render((

  <Router history={browserHistory}>
    <Route path='/' component={MainPage}/>
    <Route path='/login' component={LoginPage}/>
  </Router>

), document.getElementById('app'));
