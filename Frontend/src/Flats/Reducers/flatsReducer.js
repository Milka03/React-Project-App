import {
  FLATS_LOADED,
  FLATS_LOADING,
  FLATS_LOADING_ERROR,
  FLATS_DELETING,
  FLATS_DELETING_ERROR
} from '../../AppConstants/AppConstants'

const baseState = {
  flats: [],
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
  totalPages: 7,
  totalElements: 7,
  last: false,
  size: 10,
  number: 0,
  sort: {
    sorted: false,
    unsorted: true,
    empty: true
  },
  numberOfElements: 1,
  first: true,
  empty: false,
  pageNeighbours: 2,
  
  loading: false, 
  error: null,
  idDeleting: -1
}

export default function flatListReducer(state = baseState, action) 
{
  switch(action.type) 
  {
    case FLATS_LOADED:
      return {
        ...state, 
        flats: action.payload.content, 
        pageable: action.payload.pageable,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
        last: action.payload.last,
        size: action.payload.size,
        number: action.payload.number,
        sort: action.payload.sort,
        numberOfElements: action.payload.numberOfElements,
        first: action.payload.first,
        empty: action.payload.empty, 

        loading: false, 
        error: null
      }

    case FLATS_LOADING:
      return {...state, loading: action.payload, error: null}

    case FLATS_LOADING_ERROR:
      alert('Error: ' + action.payload);
      return {...state, loading: false, error: action.payload}

    case FLATS_DELETING:
      return {...state, loading: false, idDeleting: action.payload, error: null}

    case FLATS_DELETING_ERROR:
      alert('Error: ' + action.payload);
      return {...state, loading: false, error: action.payload}
      
    default:
      return state;
  }
}