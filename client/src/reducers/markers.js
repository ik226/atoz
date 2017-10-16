import {
  INITIAL_STATE,
  ADD_MARKER,
  REMOVE_MARKER,
  TOGGLE_MARKER,
  CLOSE_INFOWINDOW,
  addMarker,
  removeMarker,
  toggleMarker,
  closeInfoWindow,
  //postNewMarker
  postMarker,
  postMarkerSuccess,
  postMarkerFailure,
  fetchMarkers,
  fetchMarkersSuccess,
  fetchMarkersFailure,
  //initial state setup
  batchSetMarkers,
  //photo handlers
  addPhoto,
  deletePhoto,
  uploadPhoto,
  uploadPhotoSuccess,
  uploadPhotoProgress,
  uploadPhotoFailure,
  //map interaction handlers
  toggleMapIndex
} from '../actions/actions';

/*
  reducer for marker and photo
  TODO: need to rename since it is for all the data...
        i.e. dataReducer
*/

export const markerReducer = (state = INITIAL_STATE, action) => {

  switch(action.type) {

    //======== marker handlers =========//

    case 'ADD_MARKER' :
      return addMarker(state, action.position, action.id);

    case 'REMOVE_MARKER':
      return removeMarker(state, action.id);

    case 'TOGGLE_MARKER':
      return toggleMarker(state, action.id);

    case 'CLOSE_INFOWINDOW':
      return closeInfoWindow(state, action.id);

    //====temporary server communication cases====//

    case 'POST_MARKER_SUCCESS':
      return postMarkerSuccess(state);

    case 'POST_MARKER_FAILURE':
      return postMarkerFailure(state, action.error);

    case 'POST_MARKER':
      return postMarker(state);

    case 'FETCH_MARKERS':
      return fetchMarkers(state);

    case 'FETCH_MARKERS_SUCCESS':
      return fetchMarkersSuccess(state, action.data);

    //initial state set up
    case 'SET_INITIAL_STATE':
      return batchSetMarkers(state, action.data);

    //======photo reducer======//

    case 'ADD_PHOTO':
      return addPhoto(state, action.markerId, action.photoIds);

    case 'DELETE_PHOTO':
      return deletePhoto(state, action.photoId);

    case 'UPLOAD_PHOTO':
      return uploadPhoto(state);

    case "UPLOAD_PHOTO_PROGRESS":
      return uploadPhotoProgress(state, action.progress);

    case 'UPLOAD_PHOTO_SUCCESS':
      return uploadPhotoSuccess(state);

    case 'UPLOAD_PHOTO_FAILURE':
      return uploadPhotoFailure(state);

    //=========Map interaction========//

    case 'TOGGLE_MAP_INDEX':
      return toggleMapIndex(state, action.index);

    default:
      return state
  }
}
