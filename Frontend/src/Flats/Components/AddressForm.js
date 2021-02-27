import React from "react";
import { Form, Row, Col } from "react-bootstrap";

function AddressForm(props) {
  // useEffect(() => {
  //   props.validate(isAddressValid());
  // });

  const isCountryValid = () => {
    return props.address.country !== "";
  };

  const isCityValid = () => {
    return props.address.city !== "";
  };

  const isPostCodeValid = () => {
    const expression = /^\d{2}-\d{3}$/;
    return expression.test(String(props.address.postCode));
  };

  // function isAddressValid() {
  //   return isCountryValid() && isCityValid() && isPostCodeValid();
  // }

  return (
    <div>
      <Form.Group as={Row}>
        <Form.Label column sm="2">Country</Form.Label>
        <Col sm="10">
          <Form.Control type="text" name='country' value={props.address.country}
            onChange={props.changingAddress} 
            plaintext={props.isReadOnly} readOnly={props.isReadOnly} />
          { !isCountryValid() && "Please fill in your country."}
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm="2">City</Form.Label>
        <Col sm="10">
          <Form.Control type="text" name='city' value={props.address.city}
            onChange={props.changingAddress} 
            plaintext={props.isReadOnly} readOnly={props.isReadOnly} />
          { !isCityValid() && "Please fill in your city."}
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm="2">Street name</Form.Label>
        <Col sm="10">
          <Form.Control type="text" name='streetName' value={props.address.streetName}
            onChange={props.changingAddress} 
            plaintext={props.isReadOnly} readOnly={props.isReadOnly} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm="2">Post code</Form.Label>
        <Col sm="10">
          <Form.Control type="text" name='postCode' value={props.address.postCode}
            onChange={props.changingAddress} 
            placeholder="DD-DDD" 
            plaintext={props.isReadOnly} readOnly={props.isReadOnly} />
          { !isPostCodeValid() && "Please provide valid post code."}
        </Col>
      </Form.Group>
      
      <Form.Group as={Row}>
        <Form.Label column sm="2">Building number</Form.Label>
        <Col sm="10">
          <Form.Control type="text" name='buildingNumber' value={props.address.buildingNumber}
            onChange={props.changingAddress} 
            plaintext={props.isReadOnly} readOnly={props.isReadOnly} />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm="2">Flat number</Form.Label>
        <Col sm="10">
          <Form.Control type="text" name='flatNumber' value={props.address.flatNumber}
            onChange={props.changingAddress} 
            plaintext={props.isReadOnly} readOnly={props.isReadOnly} />
        </Col>
      </Form.Group>
    </div>
  )
}

export default AddressForm;