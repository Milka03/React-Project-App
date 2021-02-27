import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { addNewFlat, loadFlatAsync, onFlatChange, onFlatAddressChange, onNewImagesChanged, onShowedImgChanged, onRemoveOldImg, updateFlat } from '../Actions/flatActions';
import { deleteFlat } from '../Actions/flatsActions';
import {Form, Row, Col, Button, Card, CardDeck, Alert, Modal } from 'react-bootstrap';
import AddressForm from "./AddressForm";
import placeholder_img from '../../placeholder_img.png';
import FlatImageDropzone from './FlatImageDropzone';
import { useParams } from "react-router-dom";

import "../Layout/FlatsLayout.css"

const mapStateToProps = (state) => ({
  flat: state.flat.flat,
  loading: state.flat.loading,
  saving: state.flat.saving,
  error: state.flat.error,
  new_images: state.flat.new_images,
  showedImg: state.flat.showedImg
})
const mapDispatchToProps = (dispatch) => ({
  loadFlatAsync: (flatId) => dispatch(loadFlatAsync(flatId)),
  addNewFlat: (flat, uploadedFiles) => dispatch(addNewFlat(flat, uploadedFiles)),
  onFlatChange: (name,value) => dispatch(onFlatChange(name,value)),
  onFlatAddressChange: (name,value) => dispatch(onFlatAddressChange(name,value)),
  deleteFlat: (flatId) => dispatch(deleteFlat(flatId)),
  onNewImagesChanged: (newImgs) => dispatch(onNewImagesChanged(newImgs)),
  onShowedImgChanged: (imgPreview) =>  dispatch(onShowedImgChanged(imgPreview)),
  onRemoveOldImg: (imgName) =>  dispatch(onRemoveOldImg(imgName)),
  updateFlat: (flat, uploadedFiles) => dispatch(updateFlat(flat, uploadedFiles))
})

function FlatForm(props) {
  let { flatId } = useParams();
  const isReadOnly = props.mode === 'view';
  const [clickedRow, setClickedRow] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (props.mode == 'view' || props.mode == 'edit') {
      props.loadFlatAsync(flatId);
    }
  }, []);

  const onAddingFiles = (acceptedFiles) => {
    const currentFileNames = props.new_images.map(f => f.name);
    const filteredAddedFiles = acceptedFiles.filter(file => currentFileNames.indexOf(file.name) === -1);
    const newFiles = [
      ...props.new_images,
      ...filteredAddedFiles.map(file => (
        {
          file: file, 
          fileName: file.name,
          fileType: file.type,
          flatId: props.flat.id,
          preview: URL.createObjectURL(file),
          isOld: false
        }))
    ]
    props.onNewImagesChanged(newFiles);
    onRowClick(0, newFiles[0].preview);
  }

  const onRemovingFile = (e, index, preview) =>  {
    e.stopPropagation();
    URL.revokeObjectURL(preview);
    const newFiles = [...props.new_images];
    const nameOfRemovedImg = newFiles[index].fileName;
    newFiles.splice(index, 1);
    props.onNewImagesChanged(newFiles);
    props.onRemoveOldImg(nameOfRemovedImg);
    let newIndex = index;
    let newImgPreview = placeholder_img;
    if (index == newFiles.length && newFiles.length != 0) {
      newIndex = index - 1;
      newImgPreview = newFiles[newIndex].preview;
    } else if (index < newFiles.length) {
      newImgPreview = newFiles[newIndex].preview;
    }
    onRowClick(newIndex, newImgPreview);
  }

  const onRowClick = (rowIndex, preview) => {
    setClickedRow(rowIndex);
    props.onShowedImgChanged(preview ?? placeholder_img);
  }

  const onflatChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    props.onFlatChange(name, value);
  }

  const onAddressChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    props.onFlatAddressChange(name, value);
  }

  const onSubmit = async () => {
    if (props.mode == 'edit') {
      const currentNewImgs = props.new_images;
      props.updateFlat(props.flat, currentNewImgs.filter(x => x.isOld == false));
    }
    else {
      props.addNewFlat(props.flat, props.new_images);
    }
  }

  const onCancel = () => window.location.href = "/flats";
  const handleCloseConfirmation = () => setShowConfirmation(false);
  const handleShowConfirmation = () => setShowConfirmation(true);
  const onDeleteFlat = (flatId) => {
    props.deleteFlat(flatId);
    setShowConfirmation(false);
  }
  return (
    <div className='FlatForm' >
      { props.loading ? <Alert variant='primary'>Loading...</Alert> : 
      (props.error ? <Alert variant='danger'>Fetch error...</Alert> :
      <div>
        <div hidden={!props.saving}><Alert variant='primary'>Saving...</Alert></div>
        <CardDeck>
          <Card bg="light" border="info"> 
            <Card.Body>
              <Form>
                <Form.Group as={Row} controlId="name">
                  <Form.Label column sm="2">Name</Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" name="name" value={props.flat.name} onChange={onflatChange} 
                    plaintext={isReadOnly} readOnly={isReadOnly}/>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="maxGuests">
                  <Form.Label column sm="2">Max guests</Form.Label>
                  <Col sm="10">
                    <Form.Control type="number" min={1} name="maxGuests" value={props.flat.maxGuests} onChange={onflatChange} 
                    plaintext={isReadOnly} readOnly={isReadOnly}/>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="price">
                  <Form.Label column sm="2">Price</Form.Label>
                  <Col sm="10">
                    <Form.Control type="number" name="price" value={props.flat.price} onChange={onflatChange} 
                    plaintext={isReadOnly} readOnly={isReadOnly}/>
                  </Col>
                </Form.Group>
                <AddressForm
                  address={props.flat.address}
                  changingAddress={onAddressChange}
                  //validate={onAddressFormValidating}
                  isReadOnly={isReadOnly} />
              </Form>
            </Card.Body>
          </Card>

          <Card style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Card.Img  src={props.showedImg}/>
          </Card>

          <Card bg="light" border="info">
            <Card.Header style={{textAlign:'center'}}>UPLOADED PICTURES</Card.Header>
            <Card.Body>
            <FlatImageDropzone 
              files = {props.new_images}
              clickedRow = {clickedRow}
              onAddingFiles = {onAddingFiles} 
              onRemovingFile = {onRemovingFile}
              onRowClick= {onRowClick}
              disabled={isReadOnly}/>
            </Card.Body>

          </Card>
        </CardDeck>
        <div hidden={!isReadOnly}>
          <Button className='LargeBlueButton' 
              type="button" 
              href={`/bookings/flatId=${props.flat.id}`}>SHOW ASSOCIATED BOOKINGS</Button>
          <div className='FlatRowRight' >
            <Button className='BlueButton' 
              type="button" 
              hidden={!isReadOnly}
              href={`/flats/edit/${props.flat.id}`}>Edit</Button>
            <Button className='RedButton' 
              type="button" 
              hidden={!isReadOnly}
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
                Are you sure to delete flat {props.flat.name}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseConfirmation}>Close</Button>
                <Button variant="primary" onClick={() => onDeleteFlat(props.flat.id)}>Delete</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <div className='FlatRowCenter' hidden={isReadOnly}>
          <Button className='GreenButton' 
            type="button" 
            onClick={onSubmit}>Submit</Button>
          <Button className='RedButton' 
            type="button" 
            onClick={onCancel}>Cancel</Button>
        </div>

      </div>
      )}
    </div>
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlatForm)
