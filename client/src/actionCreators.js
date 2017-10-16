
export function addMarker(position, id){
  return {
    type: 'ADD_MARKER',
    position: position,
    id: id
  };
}

export function removeMarker(id){
  return {
    type: 'REMOVE_MARKER',
    id: id
  };
}

export function toggleMarker(id){
  return {
    type: 'TOGGLE_MARKER',
    id: id
  }
}

export function closeInfoWindow(id){
  return {
    type: 'CLOSE_INFOWINDOW',
    id: id
  }
}

/* server actions */

//========== marker handlers =============//

export function fetchRequest(){
  return{
    type: 'FETCH_MARKERS'
  }
}

export function fetchSuccess(result){
  return{
    type: 'FETCH_MARKERS_SUCCESS',
    data: result
  }
}

export function fetchFailure(err){
  return{
    type: 'FETCH_MARKERS_FAILURE',
    date: err
  }
}

export function postMarker(){
  return{
    type: 'POST_MARKER'
  }
}

export function postMarkerSuccess(){
  return{
    type: 'POST_MARKER_SUCCESS',
  }
}

export function postMarkerFailure(error){
  return{
    type: 'POST_MARKER_FAILURE',
    data: error
  }
}

export function setInitialState(data){
  return{
    type: 'SET_INITIAL_STATE',
    data: data
  }
}

//============ photo handlers ===============//
export function addPhoto(markerId, photoIds){
  return{
    type: 'ADD_PHOTO',
    markerId,
    photoIds
  }
}

export function deletePhoto(photoId){
  return {
    type: 'DELETE_PHOTO',
    photoId
  }
}

export function uploadPhoto(){
  return{
    type: 'UPLOAD_PHOTO'
  }
}

export function uploadPhotoProgress(progress){
  return {
    type: 'UPLOAD_PHOTO_PROGRESS',
    progress
  }
}

export function uploadPhotoSuccess(){
  return{
    type: 'UPLOAD_PHOTO_SUCCESS'
  }
}

export function uploadPhotoFailure(error){
  return{
    type: 'UPLOAD_PHOTO_FAILURE',
    data: error
  }
}

//============= Map interaction =================//
export function toggleMapIndex(index){
  return{
    type: 'TOGGLE_MAP_INDEX',
    index
  }
}
