import React, {Component} from 'react';
//import "../css/App.css";
import decode from 'jwt-decode';
import {LOGIN_URL, TOKEN} from '../AppConstants/AppConstants'

export const  logout = () => {
    // Clear user token and profile data from localStorage
  localStorage.removeItem("security-header");
  return localStorage.getItem("security-header")
};

class AuthHelperMethods extends Component {
  constructor(props) {
    super(props);
  }

  login = (login, password) => {
      // Get a token from api server using the fetch api
    const formData = new FormData();
    formData.append("username", login);
    formData.append("password", password);
    return this.fetch(LOGIN_URL, {
      method: "POST",
      body: formData
    }).then(res => {
      //temporary solution
      this.setToken(TOKEN); // Setting the token in localStorage
      return Promise.resolve(res);
    });
  };

  loggedIn = () => {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // Getting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  };

  isTokenExpired = token => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
          // Checking if token is expired.
        return true;
      } else return false;
    } catch (err) {
      console.log("expired check failed!");
      return false;
    }
  };

  setToken = idToken => {
    // Saves user token to localStorage
    localStorage.setItem("security-header", idToken);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem("security-header");
  };

  getConfirm = () => {
    // Using jwt-decode npm package to decode the token
    let answer = decode(this.getToken());
    console.log("Recieved answer!");
    return answer;
  };

  fetch = (url, options) => {
    // performs api calls sending the required authentication headers
    const myHeaders = {};
    if (this.loggedIn()) {
      myHeaders["security-header"] = this.getToken();
    }

    return fetch(url, {
      headers: myHeaders,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response);
  };

  _checkStatus = response => {
      // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
}

export default AuthHelperMethods;