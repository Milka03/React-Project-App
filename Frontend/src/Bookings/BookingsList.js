import React, { useEffect, useState } from "react";
import AsyncSelect from 'react-select/async';
import DateSelect from './DateSelect';
import { connect } from 'react-redux';
import { loadBookingsListAsync, cancelBooking } from './Actions/bookingsListActions';
import { useParams } from "react-router-dom";
import { Button, Alert, Form, Row, Col, Table, Modal } from 'react-bootstrap';
import Pagination from '../AppComponents/Pagination';
import "./BookingsLayout.css";
import "../BasicInputField.css";
import { BACKEND_URL, BOOKINGS_URL } from '../AppConstants/AppConstants';
import { fetchGet } from '../AppComponents/ServerApiService';

const mapStateToProps = (state, ownProps) => ({ 
    bookings: state.bookingsList.list,
    loading: state.bookingsList.loading,
    error: state.bookingsList.error,

    //For Pagination
    pageNumber: state.bookingsList.pageable.pageNumber,
    totalPages: state.bookingsList.totalPages,
    pageSize: state.bookingsList.pageable.pageSize,
    totalElements: state.bookingsList.totalElements
});

const mapDispatchToProps = (dispatch) => ({
    loadBookingsListAsync: (URL) => dispatch(loadBookingsListAsync(URL)),
    cancelBooking: (bookingId) => dispatch(cancelBooking(bookingId))
})

function BookingsList(props)
{   
    let { flatId } = useParams();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [deleteId, setdeleteId] = useState("");
    const [sort, setSort] = useState("");
    const [sortDir, setSortDir] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [startDate, setStartDate] = useState({
        value: 'null',
    });
    const { startDateWrap } = startDate;
    const [endDate, setEndDate] = useState({
        value: 'null',
    });
    const { endDateWrap } = endDate;
    const [pagingOptions, setPagingOptions] = useState({
      name: "",
      city: "",
      country: "",
      startDate: {value: 'null'},
      endDate: {value: 'null'}
    });

    useEffect(() => {props.loadBookingsListAsync(`${BOOKINGS_URL}${getOptionsStr(props.pageNumber)}`)}, [])

  const onDeleteBooking = (bookingId) => {
    props.cancelBooking(bookingId);
    setShowConfirmation(false);
  }

  const setSortingHooks = (field) =>
  {
    let { name, country, city, startDate, endDate } = pagingOptions;
    let opt_str = `?size=${props.pageSize}&page=${props.pageNumber}&omit_inactive=true${flatId ? `&flatId=${flatId}` : ""}`;
    if (name !== "") opt_str += `&name=${name}`;
    if (country !== "") opt_str += `&country=${country}`;
    if (city !== "") opt_str += `&city=${city}`;
    if (startDate.value != 'null') opt_str += `&dateFrom=${getFormattedDate(startDate.value.value)}`;
    if (endDate.value != 'null') opt_str += `&dateTo=${getFormattedDate(endDate.value.value)}`;

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
    props.loadBookingsListAsync(`${BOOKINGS_URL}${opt_str}`);
  }

  const getOptionsStr = (pageNumber) =>
  {
    let opt_str = `?size=${props.pageSize}&page=${pageNumber}&omit_inactive=true${flatId ? `&flatId=${flatId}` : ""}`;
    if (sort !== "") opt_str += `&sort=${sort},${sortDir}`;
    if (name !== "") opt_str += `&name=${name}`;
    if (country !== "") opt_str += `&country=${country}`;
    if (city !== "") opt_str += `&city=${city}`;
    if (startDate.value != 'null') opt_str += `&dateFrom=${getFormattedDate(startDate.value.value)}`;
    if (endDate.value != 'null') opt_str += `&dateTo=${getFormattedDate(endDate.value.value)}`;
    return opt_str;
  }

  const getOptionsPagingStr = (pageNumber) =>
  {
    let { name, country, city, startDate, endDate } = pagingOptions;
    let opt_str = `?size=${props.pageSize}&page=${pageNumber}&omit_inactive=true${flatId ? `&flatId=${flatId}` : ""}`;
    if (sort !== "") opt_str += `&sort=${sort},${sortDir}`;
    if (name !== "") opt_str += `&name=${name}`;
    if (country !== "") opt_str += `&country=${country}`;
    if (city !== "") opt_str += `&city=${city}`;
    if (startDate.value != 'null') opt_str += `&dateFrom=${getFormattedDate(startDate.value.value)}`;
    if (endDate.value != 'null') opt_str += `&dateTo=${getFormattedDate(endDate.value.value)}`;
    return opt_str;
  }

  const clearOptions = () => 
  {
    setName("");
    setCountry("");
    setCity("");
    setStartDate({
      value: 'null',
    });
    setEndDate({
      value: 'null',
    });
  }

  const getFormattedDate = (date) =>
  {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${year}-${month}-${day}`;
  }

  const renderTableData = () => {
    return props.bookings.map((booking) => (
        <tr key={booking.id} className='BookingsRow'>
          <td>{booking.flat.name}</td>
          <td>{booking.flat.address.country}</td>
          <td>{booking.flat.address.city}</td>
          <td>{booking.startDate} - {booking.endDate}</td>
          <td disabled={props.idDeleting !== -1}>      
          <Button className='GreenButton' type="button" 
            href={`/bookings/details/${booking.id}`}>Detail
          </Button>
          <Button className='RedButton' type="button" 
            onClick={() => {
              setShowConfirmation(true);
              setdeleteId(booking.id);
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
                Are you sure to delete the booking?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => onDeleteBooking(deleteId)}>Delete</Button>
              </Modal.Footer>
            </Modal>
        </tr>
      )
    )
  }

    return (
        <div className="BookingsList">
        {
          props.loading ? <Alert variant='primary'>Loading...</Alert> : 
            (props.error ? <Alert variant='danger'>Fetch error...</Alert> :
            <div>
              <Form className='BookingsForm'>
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
                    <Form.Label>Date From</Form.Label>
                    <DateSelect placeholder="Select Start Date..." value={startDateWrap} onChange={value => setStartDate({ value })} />
                  </Col>
                  <Col>
                    <Form.Label>Date To</Form.Label>
                    <DateSelect placeholder="Select End Date..." value={endDateWrap} onChange={value => setEndDate({ value })} />
                  </Col>
                </Row>
                <Row>
                  <Button style={{margin: 'auto', marginTop: 7, fontSize: '1.25rem', borderStyle: 'none'}} onClick={(e) => {
                    e.preventDefault();
                    setPagingOptions({
                      name: name,
                      city: city,
                      country: country,
                      startDate: startDate,
                      endDate: endDate
                    });
                    props.loadBookingsListAsync(`${BOOKINGS_URL}${getOptionsStr(props.pageNumber)}`);
                    clearOptions();
                  }}>
                    Apply Filters
                  </Button>
                </Row>
                <Row>
                  <Table className='BookingsTable'>
                    <thead>
                      <tr>
                        <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("flat.name")}}>Flat name{sort === "flat.name" ? ` - ${sortDir}` : ""}</button></th>
                        <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("flat.address.country")}}>Country{sort === "flat.address.country" ? ` - ${sortDir}` : ""}</button></th>
                        <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("flat.address.city")}}>City{sort === "flat.address.city" ? ` - ${sortDir}` : ""}</button></th>
                        <th><button onClick={(e) => {e.preventDefault(); setSortingHooks("startDate")}}>Date{sort === "startDate" ? ` - ${sortDir}` : ""}</button></th>
                        <th>Options</th>
                      </tr>
                    </thead>
                    {props.bookings && props.bookings.length > 0 ? <tbody>{renderTableData()}</tbody> : <></>}
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
                    let optionsStr = getOptionsPagingStr(pageNumber);
                    clearOptions();
                    props.loadBookingsListAsync(`${BOOKINGS_URL}${optionsStr}`);
                  }}/>
              </div>
            </div>
          )
        }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingsList);