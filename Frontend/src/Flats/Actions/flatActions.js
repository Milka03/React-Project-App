import {
  FLAT_LOADED,
  FLAT_LOADING,
  FLAT_LOADING_ERROR,
  FLAT_SAVING,
  FLAT_SAVING_ERROR,
  FLATS_URL,
  FLAT_CHANGED,
  FLAT_ADDRESS_CHANGED,
  FLAT_NEW_IMAGES_CHANGED,
  FLAT_SHOWED_IMG_CHANGED,
  FLAT_REMOVE_IMAGES
} from '../../AppConstants/AppConstants';
import {fetchGet, fetchPutWithFiles, fetchPostWithFiles, getFormData} from '../../AppComponents/ServerApiService';

export function flatLoaded(flatsResponse){
  return ({ type: FLAT_LOADED, payload: flatsResponse })
}

export function flatLoading(b){
  return ({ type: FLAT_LOADING, payload: b })
}


export function flatLoadingError(error) {
  return ({type: FLAT_LOADING_ERROR, payload: error})
}

export function flatSaving(b){
  return ({ type: FLAT_SAVING, payload: b })
}

export function flatSavingError(error) {
  return ({type: FLAT_SAVING_ERROR, payload: error})
}

export function onFlatChange(name, value) {
  return ({type: FLAT_CHANGED, payload: {name: name, value: value}})
}

export function onFlatAddressChange(name, value) {
  return ({type: FLAT_ADDRESS_CHANGED, payload: {name: name, value: value}})
}

export function onNewImagesChanged(new_images) {
  return ({type: FLAT_NEW_IMAGES_CHANGED, payload: new_images})
}

export function onShowedImgChanged(imgPreview) {
  return ({type: FLAT_SHOWED_IMG_CHANGED, payload: imgPreview})
}

export function onRemoveOldImg(imgName) {
  return ({type: FLAT_REMOVE_IMAGES, payload: imgName})
}

export function loadFlatAsync(flatId) {
  return async (dispatch) => {
    dispatch(flatLoading(true));
    let promise = fetchGet(FLATS_URL + `${flatId}`);
    promise.then(response => {
          if(!response.ok) {
            throw new Error(response.message);
          }
          return response.json();
        })
        .then(json => dispatch(flatLoaded(json)))
        .then(() => dispatch(flatLoading(false)))
        .catch((error) => dispatch(flatLoadingError(error)));
  }
}

export function addNewFlat(flat, uploadedFiles) {
  return async (dispatch) => {
    dispatch(flatSaving(true));
    const formData = getFormData(flat, uploadedFiles);
    let promise = fetchPostWithFiles(FLATS_URL, formData);
    promise.then(response => {
        if(!response.ok) {
          throw new Error(response.message);
        }
        return response;
      })
      .then(() => dispatch(flatSaving(false)))
      .then(() => window.location.href = "/flats")
      .catch((error) => dispatch(flatSavingError(error)));
  }
}

export function updateFlat(flat, uploadedFiles) {
  return async (dispatch) => {
    dispatch(flatSaving(true));
    const formData = getFormData(flat, uploadedFiles);
    let promise = fetchPutWithFiles(FLATS_URL + flat.id, formData);
    promise.then(response => {
        if(!response.ok) {
          throw new Error(response.message);
        }
        return response;
      })
      .then(() => dispatch(flatSaving(false)))
      .then(() => window.location.href = "/flats")
      .catch((error) => dispatch(flatSavingError(error)));
  }
}