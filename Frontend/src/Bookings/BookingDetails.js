import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { loadBookingDetailsAsync } from './Actions/bookingDetailsActions'
import { cancelBooking } from './Actions/bookingsListActions';
import { useParams } from "react-router-dom";
import { Form, Row, Col, Button, Card, CardDeck, Modal } from 'react-bootstrap';
import "./BookingsLayout.css";

const mapStateToProps = (state, ownProps) => ({ 
  booking: state.bookingDetails.booking,
  loading: state.bookingDetails.loading,
  saving: state.bookingDetails.saving,
  error: state.bookingDetails.error
});

const mapDispatchToProps = (dispatch) => ({
  loadBookingDetailsAsync: (bookingId) => dispatch(loadBookingDetailsAsync(bookingId)),
  cancelBooking: (bookingId) => dispatch(cancelBooking(bookingId))
})

function BookingDetails(props) {
  let { bookingId } = useParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);
  const onDeleteBooking = (bookingId) => {
    props.cancelBooking(bookingId);
    setShowConfirmation(false);
  }
    
  useEffect(() => {props.loadBookingDetailsAsync(bookingId)}, [])

  if (props.loading) {
    return (<label>Loading...</label>)
  }
  if (props.error) {
    return (<label>Fetch error</label>)
  }
  if (props.booking)
    return (
      <div>
        <CardDeck>
          <Card bg="light" border="info"> 
            <Card.Body>
              <Form>
                <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Person renting</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={`${props.booking.customer.firstName} ${props.booking.customer.lastName}`} 
                    plaintext={true} readOnly={true} />
                  </Col>
                </Form.Group>

               <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Date</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={`${props.booking.startDate} - ${props.booking.endDate}`} 
                    plaintext={true} readOnly={true} />
                  </Col>
                </Form.Group>

               <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Contact number</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={props.booking.customer.phoneNumber} 
                    plaintext={true} readOnly={true} />
                  </Col>
                </Form.Group>

               <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Booking price</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={props.booking.price} 
                    plaintext={true} readOnly={true} readOnly={true} />
                  </Col>
                </Form.Group>

               <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Number of Guests</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={props.booking.noOfGuests} 
                    plaintext={true} readOnly={true} />
                  </Col>
                </Form.Group>

               <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Flat name</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={props.booking.flat.name} 
                    plaintext={true} readOnly={true} />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Localization</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={props.booking.flat.address.country} 
                    plaintext={true} readOnly={true} />
                    <Form.Control type="text" name="name" value={`${props.booking.flat.address.city} ${props.booking.flat.address.postCode}`} 
                    plaintext={true} readOnly={true} />
                    <Form.Control type="text" name="name" 
                      value={`${props.booking.flat.address.streetName} ${props.booking.flat.address.buildingNumber}${props.booking.flat.address.flatNumber ? `/${props.booking.flat.address.flatNumber}` : ""}`} 
                    plaintext={true} readOnly={true} />
                  </Col>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </CardDeck>
        <Button className='LargeBlueButton' 
            type="button" 
            href={`/flats/details/${props.booking.flat.id}`}>GO TO FLAT DETAILS</Button>
        <div className='FlatRowRight' >
            <Button className='RedButton' 
              type="button" 
              onClick={handleShowConfirmation}>Delete</Button>
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
                Are you sure to delete the booking?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseConfirmation}>Close</Button>
                <Button variant="primary" href={`/bookings`} onClick={() => onDeleteBooking(props.booking.id)}>Delete</Button>
              </Modal.Footer>
            </Modal>
          </div>
      </div>
    );
  return (<div>Fail</div>)
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingDetails);