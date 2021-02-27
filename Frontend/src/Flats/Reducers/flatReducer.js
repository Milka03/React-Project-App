import {
  FLAT_LOADED,
  FLAT_LOADING,
  FLAT_LOADING_ERROR,
  FLAT_SAVING,
  FLAT_SAVING_ERROR,
  FLAT_CHANGED,
  FLAT_ADDRESS_CHANGED,
  FLAT_NEW_IMAGES_CHANGED,
  FLAT_SHOWED_IMG_CHANGED,
  FLAT_REMOVE_IMAGES
} from '../../AppConstants/AppConstants';

import placeholder_img from '../../placeholder_img.png';

const baseState = {
  flat: {
    id: 0,
    name: "",       
    maxGuests: 1,
    price: 0,
    flatType: "Apartment",
    address: {
      country: "", 
      city: "", 
      streetName: "", 
      postCode: "", 
      buildingNumber: "", 
      flatNumber: ""
    },
    images: []
  },
  loading: false, 
  saving: false,
  error: null,
  new_images: [],
  showedImg: placeholder_img
}
export default function flatReducer(state = baseState, action) 
{
  switch(action.type) 
  {
    case FLAT_LOADED:
      return {
        ...state, 
        flat: action.payload,
        loading: false, 
        error: null,
        new_images: action.payload.images.map(x => ({
          file: {size: x.data.length},
          fileName: x.fileName,
          fileType: x.fileType,
          flatId: action.payload.id,
          preview: `data:${x.fileType};base64,${x.data}`,
          isOld: true
        })),
        showedImg: action.payload.images.length > 0 
        ? `data:${action.payload.images[0].fileType};base64,${action.payload.images[0].data}`
        : placeholder_img
      }

    case FLAT_LOADING:
      return {...state, loading: action.payload, error: null}

    case FLAT_LOADING_ERROR:
      alert('Error: ' + action.payload);
      return {...state, loading: false, saving: false, error: action.payload}

    case FLAT_SAVING:
      return {...state, loading: false, saving: action.payload, error: null}

    case FLAT_SAVING_ERROR:
      alert('Error: ' + action.payload);
      return {...state, loading: false, saving: false,  error: action.payload}

    case FLAT_CHANGED:
      return {
        ...state, 
        flat: {
          ...state.flat,
          [action.payload.name]: action.payload.value
        }
      }

    case FLAT_ADDRESS_CHANGED:
      return {
        ...state, 
        flat: {
          ...state.flat,
          address: {
            ...state.flat.address,
            [action.payload.name]: action.payload.value
          }
        }
      }

    case FLAT_NEW_IMAGES_CHANGED:
      return {
        ...state, 
        new_images: action.payload
      }   

    case FLAT_SHOWED_IMG_CHANGED:
      return {
        ...state, 
        showedImg: action.payload
      } 

    case FLAT_REMOVE_IMAGES:
      const currentImgs = state.flat.images;
      return {
        ...state, 
        flat: {
          ...state.flat,
          images: currentImgs.filter(x => x.fileName !== action.payload)
        }
      } 

    default:
      return state;
  }
}