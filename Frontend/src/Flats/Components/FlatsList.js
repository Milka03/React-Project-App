import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { deleteFlat, loadFlatListAsync } from '../Actions/flatsActions';
import { Button, Alert, Form, Row, Col, Table, Modal } from 'react-bootstrap';
import Pagination from '../../AppComponents/Pagination';
import "../Layout/FlatsLayout.css";
import { DEBUGGING, BACKEND_URL, FLATS_URL } from '../../AppConstants/AppConstants';
import { fetchGet } from '../../AppComponents/ServerApiService';

const mapStateToProps = (state) => ({ 
  flats: state.flats.flats,
  loading: state.flats.loading,
  idDeleting: state.flats.idDeleting,
  error: state.flats.error,

  //For Pagination
  pageNumber: state.flats.pageable.pageNumber,
  totalPages: state.flats.totalPages,
  pageSize: state.flats.pageable.pageSize,
  totalElements: state.flats.totalElements
});

const mapDispatchToProps = (dispatch) => ({
  loadFlatListAsync: (URL) => dispatch(loadFlatListAsync(URL)),
  deleteFlat: (flatId) => dispatch(deleteFlat(flatId)),
})

function FlatsList(props) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setdeleteId] = useState("");
  const [deleteName, setdeleteName] = useState("");
  const [sort, setSort] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [MGLower, setMGLower] = useState("");
  const [MGUpper, setMGUpper] = useState("");
  const [priceLower, setPriceLower] = useState("");
  const [priceUpper, setPriceUpper] = useState("");
  const [pagingOptions, setPagingOptions] = useState({
    name: "",
    city: "",
    country: "",
    MGLower: "",
    MGUpper: "",
    priceLower: "",
    priceUpper: "",
  });

  useEffect(() => {props.loadFlatListAsync(`${FLATS_URL}${getOptionsStr(props.pageNumber)}`)}, []);
  
  const onDeleteFlat = (flatId) => {
    props.deleteFlat(flatId);
    setShowConfirmation(false);
  }

  const setSortingHooks = (field) =>
  {
    let { name, country, city, MGLower, MGUpper, priceLower, priceUpper } = pagingOptions;
    let opt_str = `?size=${props.pageSize}&page=${props.pageNumber}`;
    if (name !== "") opt_str += `&name=${name}`;
    if (country !== "") opt_str += `&country=${country}`;
    if (city !== "") opt_str += `&city=${city}`;
    if (MGLower !== "") opt_str += `&guestsFrom=${MGLower}`;
    if (MGUpper !== "") opt_str += `&guestsTo=${MGUpper}`;
    if (priceLower !== "") opt_str += `&priceFrom=${priceLower}`;
    if (priceUpper !== "") opt_str += `&priceTo=${priceUpper}`;

    if (sort === field)
    {
      if(sortDir === "asc") 
      {
        setSortDir("desc");
        opt_str += `&sort=${field},desc`;
      }
      else if(sortDir === "desc") 
      {
        setSort("");
        setSortDir("");
      }
    }
    else
    {
      setSort(field);
      setSortDir("asc");
      opt_str += `&sort=${field},asc`;
    }
    props.loadFlatListAsync(`${FLATS_URL}${opt_str}`);
  }

  const getOptionsStr = (pageNumber) =>
  {
    let opt_str = `?size=${props.pageSize}&page=${pageNumber}`;
    if (sort !== "") opt_str += `&sort=${sort},${sortDir}`;
    if (name !== "") opt_str += `&name=${name}`;
    if (country !== "") opt_str += `&country=${country}`;
    if (city !== "") opt_str += `&city=${city}`;
    if (MGLower !== "") opt_str += `&guestsFrom=${MGLower}`;
    if (MGUpper !== "") opt_str += `&guestsTo=${MGUpper}`;
    if (priceLower !== "") opt_str += `&priceFrom=${priceLower}`;
    if (priceUpper !== "") opt_str += `&priceTo=${priceUpper}`;
    return opt_str;
  }

  const clearOptions = () => 
  {
    setName("");
    setCountry("");
    setCity("");
    setMGLower("");
    setMGUpper("");
    setPriceLower("");
    setPriceUpper("");
  }

  const renderTableData = () => {
    return props.flats.map((flat, index) => (
        <tr key={index} className='FlatsRow'>
          <td>{flat.name}</td>
          <td>{flat.address.country}</td>
          <td>{flat.address.city}</td>
          <td>{flat.maxGuests}</td>
          <td>{flat.price}</td>
          <td disabled={props.idDeleting !== -1}>      
            <Button className='GreenButton' type="button" 
              href={`/flats/details/${flat.id}`}>Detail
            </Button>
            <Button className='BlueButton' type="button" 
              href={`/flats/edit/${flat.id}`}>Edit
            </Button>
            <Button className='RedButton' type="button" 
              onClick={() => {
                setShowConfirmation(true);
                setdeleteName(flat.name);
                setdeleteId(flat.id);
              }}>Delete
            </Button>
          </td>
          <Modal
              show={showConfirmation}
              onHide={() => setShowConfirmation(false)}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure to delete flat {deleteName}?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => onDeleteFlat(deleteId)}>Delete</Button>
              </Modal.Footer>
            </Modal>
        </tr>
      )
    )
  }

  return (
    <div className="FlatsList">
    {
      props.loading ? <Alert variant='primary'>Loading...</Alert> : 
        (props.error ? <Alert variant='danger'>Fetch error...</Alert> :
        <div>
          <Form className='FlatsForm'>
            <Row>
              <Col>
                <Form.Label>Search by Flat's name</Form.Label>
                <input className="BasicInputField" placeholder="Flat's name" type="text" onChange={(e) => setName(e.target.value)}/>
              </Col>
              <Col>
                <Form.Label>Country</Form.Label>
                <AsyncSelect className="single-select" classNamePrefix="select" 
                      isDisabled={city !== ""} isClearable={true} isRtl={false} isSearchable={true}
                      name="countrySelect"
                      placeholder="Select Country..."
                      defaultOptions
                      loadOptions = {(inputValue, callback) => {
                        setTimeout(() => {
                          fetchGet(`${BACKEND_URL}metadata/countries`)
                            .then(promise => {return promise.status === 404 ? [] : promise.json()})
                            .then(json => 
                              {
                                let filtered = json.filter(i => i.toLowerCase().includes(inputValue.toLowerCase()));
                                callback(filtered.map((i) => {return {value: i, label: i}}));
                              }
                            );
                        }, 1000)
                      }}
                      onChange={(opt) => { opt != null ? setCountry(opt.value) : setCountry("")}}
                    />
              </Col>
              <Col>
                <Form.Label>City</Form.Label>
                <AsyncSelect className="single-select" classNamePrefix="select" 
                  isDisabled={false} isClearable={true} isRtl={false} isSearchable={true}
                  name="citySelect"
                  placeholder="Select City..."
                  defaultOptions
                  loadOptions = {(inputValue, callback) => {
                    setTimeout(() => {
                      fetchGet(`${BACKEND_URL}metadata/cities${country !== "" ? `?country=${country}` : ""}`)
                        .then(promise => {return promise.status === 404 ? [] : promise.json()})
                        .then(json => 
                          {
                            let filtered = json.filter(i => i.toLowerCase().includes(inputValue.toLowerCase()));
                            callback(filtered.map((i) => {return {value: i, label: i}}));
                          }
                        );
                    }, 1000)
                  }}
                  onChange={(opt) => { opt != null ? setCity(opt.value) : setCity("")}}
                />
              </Col>
              <Col>
                <Form.Label>Max guests</Form.Label>
                <input className="BasicInputField" placeholder="Min" type="number" min={1} onChange={(e) => setMGLower(e.target.value)}/>
                <input className="BasicInputField" placeholder="Max" type="number" min={1} onChange={(e) => setMGUpper(e.target.value)}/>
              </Col>
              <Col>
                <Form.Label>Price</Form.Label>
                <input className="BasicInputField" placeholder="Min" type="number" min={1} onChange={(e) => setPriceLower(e.target.value)}/>
                <input className="BasicInputField" placeholder="Max" type="number" min={1} onChange={(e) => setPriceUpper(e.target.value)}/>
              </Col>
            </Row>
            <Row >
             <Button style={{marginLeft: 'auto', marginRight: 8, marginTop: 9, fontSize: '1.25rem', borderStyle: 'none'}} onClick={(e) => {
                e.preventDefault();
                setPagingOptions({
                  name: name,
                  city: city,
                  country: country,
                  MGLower: MGLower,
                  MGUpper: MGUpper,
                  priceLower: priceLower,
                  priceUpper: priceUpper,
                });
                props.loadFlatListAsync(`${FLATS_URL}${getOptionsStr(props.pageNumber)}`);
                clearOptions();
              }}>
                Apply Filters
              </Button>
              <Button type="button" style={{marginLeft: 8, marginRight: 'auto', marginTop: 9, fontSize: '1.25rem', backgroundColor: '#0f9b0f', borderStyle: 'none'}}
                  hidden={props.loading || props.saving}
                  disabled={props.idDeleting !== -1}
                  href={`/flats/add`}
                  size="lg">
                    Add new flat
                </Button>
            </Row>
            <Row>
              <Table className='FlatsTable'>
                <thead>
                  <tr>
                    <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("name")}}>Flat name{sort === "name" ? ` - ${sortDir}` : ""}</button></th>
                    <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("address.country")}}>Country{sort === "address.country" ? ` - ${sortDir}` : ""}</button></th>
                    <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("address.city")}}>City{sort === "address.city" ? ` - ${sortDir}` : ""}</button></th>
                    <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("maxGuests")}}>Max guests{sort === "maxGuests" ? ` - ${sortDir}` : ""}</button></th>
                    <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("price")}}>Price{sort === "price" ? ` - ${sortDir}` : ""}</button></th>
                    <th>Options</th>
                  </tr>
                </thead>
                {props.flats && props.flats.length > 0 ? <tbody>{renderTableData()}</tbody> : <></>}
              </Table>
            </Row>
          </Form>
          <div className="d-flex flex-row py-4 align-items-center">
            <Pagination 
              pageNumber = {props.pageNumber}
              totalPages = {props.totalPages}
              pageSize = {props.pageSize}
              totalElements = {props.totalElements}
              onChangingPage = {(pageNumber) => {
                clearOptions();
                let { name, country, city, MGLower, MGUpper, priceLower, priceUpper } = pagingOptions;
                let opt_str = `?size=${props.pageSize}&page=${pageNumber}`;
                if (name !== "") opt_str += `&name=${name}`;
                if (country !== "") opt_str += `&country=${country}`;
                if (city !== "") opt_str += `&city=${city}`;
                if (MGLower !== "") opt_str += `&guestsFrom=${MGLower}`;
                if (MGUpper !== "") opt_str += `&guestsTo=${MGUpper}`;
                if (priceLower !== "") opt_str += `&priceFrom=${priceLower}`;
                if (priceUpper !== "") opt_str += `&priceTo=${priceUpper}`;
                props.loadFlatListAsync(`${FLATS_URL}${opt_str}`);
              }}/>
          </div>
        </div>
      )
    }
    </div>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(FlatsList);