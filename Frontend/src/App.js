import React, {Fragment, useState} from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk'
import { BrowserRouter as Router, Route} from "react-router-dom";
import appReducers from './AppReducers/appReducers'
import {composeWithDevTools} from 'redux-devtools-extension';
import {  Nav,  Navbar,  Form, Button, Modal } from 'react-bootstrap';
import { withRouter } from "react-router";

import FlatsList from './Flats/Components/FlatsList' 
import FlatForm from './Flats/Components/FlatForm';
import BookingsList from './Bookings/BookingsList' 
import BookingDetails from "./Bookings/BookingDetails";
import LoginPage from './LoginPage'
import {logout} from './AppComponents/AuthHelperMethods'
import './App.css';
import './App.scss';
const store = createStore(appReducers, {}, composeWithDevTools((applyMiddleware(reduxThunk))));


function NavigatorBar(props) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);
  const handleLogOut = () => {
    logout();
    props.history.push("/");
  }
  return(
  <Navbar bg="dark" 
  variant="dark" 
  className='NavBar'>
    <Navbar.Brand href="/flats">FLATLY</Navbar.Brand>
    <Nav className="mr-auto" activeKey={window.location.pathname}>
      <Nav.Link href="/flats" >Flats</Nav.Link>
      <Nav.Link href="/bookings" >Bookings</Nav.Link>
    </Nav>
    <Form inline>
      <Button className="ButtonLogout" onClick={handleShowConfirmation}>Log Out</Button>
      <Modal
        show={showConfirmation}
        onHide={handleCloseConfirmation}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure to log out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>Cancel</Button>
          <Button variant="primary" onClick={handleLogOut}>Log out</Button>
        </Modal.Footer>
      </Modal>
    </Form>
  </Navbar>
  )
}
const HeaderWithRouter = withRouter(NavigatorBar);

function App() {
  const mainURL = "http://localhost:8080";

  return (
    <Provider store = {store}>
      <Router>
        <Fragment>
          <Route path={`/bookings/details/:bookingId`} exact>
            <HeaderWithRouter />
            <BookingDetails />
          </Route>
          <Route path="/bookings/flatId=:flatId" exact>
            <HeaderWithRouter />
            <BookingsList />
          </Route>
          <Route path="/bookings" exact>
            <HeaderWithRouter />
            <BookingsList />
          </Route>
          <Route path="/flats/add" exact>
            <HeaderWithRouter />
            <FlatForm mode='create'/>
          </Route>
          <Route path={`/flats/details/:flatId`} exact>
            <HeaderWithRouter />
            <FlatForm mode='view'/>
          </Route>
          <Route path={`/flats/edit/:flatId`} exact>
            <HeaderWithRouter />
            <FlatForm mode='edit'/>
          </Route>
          <Route path="/flats" exact>
            <HeaderWithRouter />
            <FlatsList />
          </Route>
          <Route path="/" exact>
            <LoginPage />
          </Route>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
