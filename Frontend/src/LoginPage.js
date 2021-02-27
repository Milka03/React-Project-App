import React, { useState } from "react";
import { Alert } from 'react-bootstrap'
import AuthHelperMethods from "./AppComponents/AuthHelperMethods";
import { withRouter } from "react-router";

function LoginPage(props)
{   
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const isFormValid = () => {
    return login.length > 0 && password.length > 0
  }
  const logIn = (e) => {
    e.preventDefault();
    Auth.login(login, password)
      .then(res => {
        if (res === false) {
          return alert("Sorry those credentials don't exist!");
        };
        props.history.push("/flats");
      })
      .catch((e) => {setLoginFailed(true);console.warn(e.message)});
  }
  const Auth = new AuthHelperMethods();
  const onChangeLogin = (e) => {
    setLogin(e.target.value);
    setLoginFailed(false);
  }
  const onChangePass = (e) => {
    setPassword(e.target.value);
    setLoginFailed(false);
  }
  return(
    <div className="outer">
      <div className="inner">  
        <form>
          <h3>Log in</h3>
          <div className="form-group">
              <label>Username</label>
              <input type="text" className="form-control" placeholder="Login" onChange={onChangeLogin}/>
          </div>
          <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Enter password" onChange={onChangePass}/>
          </div>
          <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={logIn}>Sign in</button>
          {loginFailed && <Alert color="danger">
            Incorrect username or password! Try again.
          </Alert>}
        </form>        
      </div>
    </div>
  )
}
export default (withRouter(LoginPage));