const baseState = {
    list: [],
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

export default function bookingsListReducer(state = baseState, action) 
{
    switch(action.type) 
    {
        case "bookingsListLoaded":
            return {...state,
                list: action.payload.content, 
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

        case "bookingsListLoading":
            return {...state, loading: true}

        case "bookingsListLoadingError":
            return {...state, loading: false, error: action.payload}

        case "bookingCanceling":
            const updatedList = state.list.map(booking => booking.id === action.payload ? {...booking, canceling: true} : booking)
            return {...state, list: updatedList, idDeleting: action.payload, loading: false}

        case "bookingCancelingError":
            return {...state, loading: false, error: action.payload}
            
        default:
            return state;
    }
}