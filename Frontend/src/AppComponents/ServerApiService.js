import {
  BACKEND_URL, FLATS_URL, DEBUGGING, TESTING, TOKEN
} from '../AppConstants/AppConstants';

function getHeader(requestType) {
  let headers = {"Content-Type": requestType};
  if (TESTING) {
    headers["security-header"] = TOKEN;
  }
  else {
    headers["security-header"] = localStorage.getItem("security-header")
  }
  return headers;
}

export const fetchGet = (url, params = null) => {
  let finalUrl = url + ((params == null) ? '' : params);
  return fetch(finalUrl, {headers: getHeader("application/json")});
}

export const fetchPut = (url) => {
  return fetch(url, {method: "PUT", headers: getHeader("multipart/form-data")});
}

export const fetchPost = (url) => {
  return fetch(url, {method: "POST", headers: getHeader("application/json")});
}

export const fetchDelete = (url) => {
  return fetch(url, {method: "DELETE", headers: getHeader("application/json")});
}

export const fetchPostWithFiles = (url, formData) => {
  return fetch(url, {
    method: 'POST', 
    headers: {
      "security-header": (TESTING) ? TOKEN : localStorage.getItem("security-header")
    },
    body: formData
  });
}

export const fetchPutWithFiles = (url, formData) => {
  return fetch(url, {
    method: 'PUT', 
    headers: {
      "security-header": (TESTING) ? TOKEN : localStorage.getItem("security-header")
    },
    body: formData
  });
}

export const getFormData = (flat, uploadedFiles = []) => {
  const formData = new FormData();
  for (let i = 0 ; i < uploadedFiles.length ; i++) {
    formData.append("new_images", uploadedFiles[i].file);
  }
  for (var key in flat) {
    if (key == 'address') {
      formData.append('address.country',flat.address.country);
      formData.append('address.city',flat.address.city);
      formData.append('address.postCode',flat.address.postCode);
      formData.append('address.buildingNumber',flat.address.buildingNumber);
      formData.append('address.flatNumber',flat.address.flatNumber);
      formData.append('address.streetName',flat.address.streetName);
    }
    else if (key == 'images') {
      for (let i = 0 ; i < flat.images.length ; i++) {
        formData.append(`images[${i}].id`, flat.images[i].id);
      }
      if (flat.images.length == 0) {
        formData.append(`images`, []);
      }
    } 
    else {
      formData.append(key, flat[key]);
    }
  }
  for (var pair of formData.entries()) {
    console.log(pair[0]+ ':' + pair[1]); 
  }
  return formData;
}