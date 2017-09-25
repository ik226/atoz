//action types
import { List, Map, fromJS } from 'immutable';
import axios from 'axios';
import { v4 } from 'uuid';

export const ADD_MARKER = 'ADD_MARKER';
export const REMOVE_MARKER = 'REMOVE_MARKER';
export const ADD_PHOTO = 'ADD_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';
export const TOGGLE_MARKER = 'TOGGLE_MARKER';
export const CLOSE_INFOWINDOW = 'CLOSE_INFOWINDOW';


export const INITIAL_STATE = Map()
  .set('markers', Map())
  .set('loadingPost', false) //for marker post request
  .set('loadingFetch', false) //for marker get request
  .set('photos', Map()) //TODO: its time for photo....
  .set('uploadingProgress', 0) //for photo uploading
  .set('uploading', false)
  .set('currentDataForGallery', null) //for gallery to know what is the current marker
  .set('currentMapIndex', 'a'); //default center is index 'a'

var defaultPhoto = Map({
  id: null,
  marker: null,
  path: null
})

var defaultMarker = Map({
  //TODO: currently position is plain js object...
  //      should this be immutable obj??
  position: null,
  defaultAnimation: 3,
  id: null,
  showInfo: false, //TODO:this need to be inside marker's local state
  photos: List(),
  display: true
});

//set initial state with fetched data
export const batchSetMarkers = (state, response) => {
  /*
    state shape
    {
      data: Map {"markers", "photos", ...}
      asyncInitialState:
    }
  */
  if(!Object.keys(response).length){
    console.log('no content in response')
    return state;
  }
  //console.log(response)

  state.data = state.data.withMutations(state =>
    response.markers.forEach( marker => {
      let id = marker.id;
      let photos = List(marker.photos.map((photo)=>{ return photo.id; }));
      let defaultAnimation = marker.defaultAnimation;
      let position = marker.position;
      let display = marker.display;
      let newMarker = defaultMarker.set('id', id)
        .set('photos', photos)
        .set('defaultAnimation', defaultAnimation)
        .set('position', position)
        .set('display', display);

      state.setIn(['markers', id], newMarker);
    })
  );
  state.data = state.data.withMutations(state =>
    response.photos.forEach( photo => {
      let id = photo.id;
      let path = photo.path;
      let marker = photo.markerId;
      let newPhoto = defaultPhoto.set('id', id)
          .set('path', path)
          .set('marker', marker);

      state.setIn(['photos', id], newPhoto);

    })

  );

  return state;
}

// within data scope //

export const addMarker = (state, position, id) => {

  const nextMarkerId = id;

  let newMarker = defaultMarker.set('position', position)
    .set('id', nextMarkerId);
  let newState = state.setIn(
    ['markers', nextMarkerId],
    newMarker
  )

  return newState;
}

export const removeMarker = (state, markerID) => {
  return state.deleteIn(['markers', markerID]).set('currentDataForGallery', null);
}

export const toggleMarker = (state, markerID) => {

  return state
    .setIn(['markers', markerID, 'showInfo'], true)
    .set('currentDataForGallery', state.getIn(['markers', markerID,'photos']));
}

export const closeInfoWindow = (state, markerID) => {
  return state
    .setIn(['markers', markerID, 'showInfo'], false)
    .set('currentDataForGallery', null);
}

/*
  server communication functions inside middlewares
*/

export const FETCH_MARKERS = 'FETCH_MARKERS';
export const FETCH_MARKERS_SUCCESS = 'FETCH_MARKERS_SUCCESS';
export const FETCH_MARKERS_FAILURE = 'FETCH_MARKERS_FAILURE';

const ROOT_URL = 'http://localhost:3000/api';

export const fetchMarkers = (state) => {
  return state.set('loadingFetch', true);
}

//TODO: incomplete
export const fetchMarkersSuccess = (state) => {
  return state.set('loadingFetch', false);
}

export const fetchMarkersFailure = (state, error) => {
  return state.set('loadingFetch', true).set('error', error);
}

//only handle lodaing status of state
export const postMarkerSuccess = (state) => {
  return state.set('loadingPost', false);
}

export const postMarkerFailure = (state, error) => {
  return state.set('loadingPost', false).set('error', error);
}

export const postMarker = (state) => {
  return state.set('loadingPost', true);
}

/*
  Photos
*/

//TODO: set path to defaultPhoto
export const addPhoto = (state, markerId, photoId) => {
  const newPhoto = defaultPhoto
    .set('marker', markerId).set('id',photoId);
  //const photoIdList = fromJS(photoId);
  const nextState = state.updateIn(
    ['markers', markerId, 'photos'],
    photos => photos.concat(photoId));
  const finalState = nextState
    .setIn(['photos', photoId], newPhoto);
  if(state.get('currentDataForGallery')){
    return finalState.update('currentDataForGallery',
      currentDataForGallery => currentDataForGallery.concat(photoId));
  }

  return finalState;
}

export const deletePhoto = (state, photoId) => {
  const markerId = state.getIn(["photos", photoId, "marker"]);
  //console.log(markerId, photoId);
  const handlePhotoState = state.deleteIn(["photos", photoId]);
  console.log(handlePhotoState);
  const filteredState = handlePhotoState.updateIn(["markers", markerId, "photos"],
    photos => photos.filter(ids => ids !== photoId));

  //console.log(handlePhotoState)
  //console.log(handlePhotoState.getIn(["markers", markerId, "photos"]));

  if(filteredState.get('currentDataForGallery')){

    const finalState = filteredState.update('currentDataForGallery',
      currentDataForGallery =>
      currentDataForGallery.filter(id => id !== photoId)
    );


    return finalState;
  }
  return filteredState;
}

export const uploadPhoto = (state) => {
  return state.set('uploading', true);
}

export const uploadPhotoProgress = (state, progress) => {
  return state.set('uploadingProgress', progress);
}

export const uploadPhotoSuccess = (state) => {
  return state.set('uploading', false).set('uploadingProgress', 0);
}

/*
  Map Interactions
*/

export const toggleMapIndex = (state, index) => {
  return state.set('currentMapIndex', index);
}
