import { BOOKINGS_URL } from '../../AppConstants/AppConstants';
import {fetchGet, fetchDelete} from '../../AppComponents/ServerApiService'

export function bookingsListLoaded(list) {
    return ({type: "bookingsListLoaded", payload: list})
}

export function bookingsListLoading() {
    return ({type: "bookingsListLoading"})
}

export function bookingsListLoadingError(error) {
    return ({type: "bookingsListLoadingError", payload: error})
}

export function loadBookingsListAsync(URL) {
    return async (dispatch) => {
        try {
            dispatch(bookingsListLoading());
            const response = await fetchGet(URL);
            const json = await response.json();
            dispatch(bookingsListLoaded(json));
        } catch(error) {
            console.error(error);
            dispatch(bookingsListLoadingError(error));
        }
    }
}

export function bookingCanceling(bookingId) {
    return {type: "bookingCanceling", payload: bookingId}
}

export function bookingCancelingError(error) {
    return ({type: "bookingCancelingError", payload: error})
}

export function cancelBooking(bookingId) {
    return async (dispatch) => {
        try {
            dispatch(bookingCanceling(bookingId))
            await fetchDelete(BOOKINGS_URL + bookingId, {method: 'DELETE'});
            dispatch(loadBookingsListAsync(BOOKINGS_URL));
        } catch(error) {
            console.error(error);
            dispatch(bookingCancelingError(error))
        }
    }
}
