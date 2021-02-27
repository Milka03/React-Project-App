import { combineReducers } from 'redux';
import flatsReducer from '../Flats/Reducers/flatsReducer';
import flatReducer from '../Flats/Reducers/flatReducer';
import bookingsListReducer from '../Bookings/Reducers/bookingsListReducer'
import bookingDetailsReducer from '../Bookings/Reducers/bookingDetailsReducer'


 const appReducers = combineReducers({
    flats: flatsReducer,
    flat: flatReducer,
    bookingsList: bookingsListReducer,
    bookingDetails: bookingDetailsReducer
 });

 export default appReducers;