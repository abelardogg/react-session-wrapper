import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SessionContext from './SessionContext';
import * as serviceWorker from './serviceWorker';

//initial config
const loginUrl = process.env.REACT_APP_LOGIN;
const getTokenUrl = process.env.REACT_APP_GET_TOKEN_URL;
let headers = new Headers();
// append your values
let urlencoded = new URLSearchParams();
// append your values

ReactDOM.render(
  <React.StrictMode>
    <SessionContext
      loginUrl={loginUrl}     // redirect to the login page
      tokenUrl={getTokenUrl}  // get the jwt with the code 
      logoutRedirect={'/'}    // redirect when user perform a logout action
      body={urlencoded}       // request body (like scopes, client id, etc...)
      headers={headers}       // request headers (like ocntent-tyope)
      sessionKey={'id_token'} // key to read from storage to keep the session.
    >
      <App />
    </SessionContext>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
