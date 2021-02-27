import {
    FLATS_LOADED,
    FLATS_LOADING,
    FLATS_LOADING_ERROR,
    FLATS_DELETING,
    FLATS_DELETING_ERROR,
    FLATS_URL,
    DEBUGGING, TESTING
} from '../../AppConstants/AppConstants';
import {fetchGet, fetchDelete} from '../../AppComponents/ServerApiService'

export function flatListLoaded(flatsResponse){
  return ({ type: FLATS_LOADED, payload: flatsResponse })
}

export function flatListLoading(b){
  return ({ type: FLATS_LOADING, payload: b })
}


export function flatListLoadingError(error) {
  return ({type: FLATS_LOADING_ERROR, payload: error})
}

export function flatDeleting(flatId) {
  return ({type: FLATS_DELETING, payload: flatId })
}

export function flatDeletingError(error) {
  return ({type: FLATS_DELETING_ERROR, payload: error})
}

export function loadFlatListAsync(URL) {
  if (DEBUGGING) {
    return async (dispatch) => {
      dispatch(flatListLoading(true));
      let promise = fetchGet(URL);
      promise.then(response => response.json())
          .then(json => dispatch(flatListLoaded({
            content: json,
            pageable: {
              sort: {
                sorted: false,
                unsorted: true,
                empty: true
              },
              offset: 0,
              pageNumber: 0,
              pageSize: 10,
              unpaged: false,
              paged: true
            },
            totalPages: 10,
            totalElements: 95,
            last: false,
            size: json.length,
            number: 0,
            sort: {
              sorted: false,
              unsorted: true,
              empty: true
            },
            numberOfElements: json.length,
            first: true,
            empty: false
          })))
          .then(() => dispatch(flatListLoading(false)))
          .catch((error) => dispatch(flatListLoadingError(error)));
    }
  }
  return async (dispatch) => {
    dispatch(flatListLoading(true));
    let promise = fetchGet(URL);
    promise.then(response => response.json())
        .then(json => dispatch(flatListLoaded(json)))
        .then(() => dispatch(flatListLoading(false)))
        .catch((error) => dispatch(flatListLoadingError(error)));
  }
}

export function deleteFlat(flatId) {
  return async (dispatch) => {
    dispatch(flatDeleting(flatId))
    let promise = fetchDelete(FLATS_URL + flatId);
    promise.then(response => {
          if(!response.ok) {
            throw new Error(response.message);
          }
          return response;
        })
        .then(() => dispatch(flatDeleting(-1)))
        .catch((error) => dispatch(flatDeletingError(error)))
        .finally(() => window.location.href = "/flats");
  }
}
