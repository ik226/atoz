import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import { bindActionCreators } from 'redux';

//temp util import for actions
import axios from 'axios';
import { v4 } from 'uuid';

//components
import { BroadwayMap } from './BroadwayMap';
import { UploadformContainer } from './Uploadform/UploadformContainer';
import { Gallery } from './Gallery/Gallery';
import { PostLoadingIndicator } from './PostLoadingIndicator';
//import { AsideNav } from './AsideNav';
import { Minimap } from './Minimap';

//action
import * as actionCreators from '../actionCreators';

//temp storage for path coords
const longJourney = [
  {lat: 41.081, lng: -73.858},
  {lat: 41.078, lng: -73.858},
  {lat: 41.073, lng: -73.859},
  {lat: 41.067, lng: -73.862},
  {lat: 41.054, lng: -73.861},
  {lat: 41.047, lng: -73.861}
];

//temp storage for centers
const mapCenters = {
  a: { lat: 41.05579642354099, lng: -73.86125564575195 },
  b: { lat: 40.992,lng: -73.878},
  c: { lat: 40.933, lng: -73.898}
};




export class MapController extends Component {
  constructor(props){
    super(props);

    this.state = {

      //upload form show
      showUploadForm: false,
      //set temp. upload marker
      currentUploadMarker: [],
      //show gallery
      showGallery: false,
      directions: null,
      defaultCenter: { lat: 41.05579642354099, lng: -73.86125564575195 },

      //traveler controller
      currentTravelerLoc: 1
    };

    this.handleOpenUploadForm = this.handleOpenUploadForm.bind(this);
    this.handleCloseUploadForm = this.handleCloseUploadForm.bind(this);
    this.moveTravelerUp = this.moveTravelerUp.bind(this);
    this.moveTravelerDown = this.moveTravelerDown.bind(this);
  }

  componentDidMount(){
    //direction service test
    const DirectionsService = new window.google.maps.DirectionsService();
    const _origin = new window.google.maps.LatLng(41.05579642354099, -73.86125564575195);
    const _destination = new window.google.maps.LatLng(40.706, -74.014);
    DirectionsService.route({
      origin: _origin,
      destination: _destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if(status === 'OK'){
        this.setState({
          directions: result
        });
      } else {
        console.log('error get direction service');
      }
    });
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.uploadingSuccess && !nextProps.uploading){
      this.handleCloseUploadForm()
    }
  }

  mouseScrollController(e){
    e.preventDefault()
    var dir = e.deltaY > 0 ? 'up' : 'down'
    switch(dir){
      case 'up':
        this.moveTravelerUp()
        return
      case 'down':
        this.moveTravelerDown()
        return
      default:
        return
    }
  }

  //open upload form
  //TODO: do we need to set current marker to state??
  handleOpenUploadForm(marker){

    this.setState({showUploadForm: true});
    let _current = [
      marker.get('position').lat,
      marker.get('position').lng,
      marker.get('id')
    ];
    this.setState({currentUploadMarker: _current});
  }

  //close upload form
  handleCloseUploadForm(){
    this.setState({showUploadForm: false});
  }

  //traveler controller
  //moves it downward
  moveTravelerDown(){
    this.setState(prevState => {
      let iconLoc = getIconLocation(prevState.currentTravelerLoc + 0.5);
      getNearestMarker(
        iconLoc,
        this.props.markers,
        this.props.handleMarkerClick,
        this.props.handleMarkerClose
      );
      if(prevState.currentTravelerLoc + 0.5 < 100){
       return {
         currentTravelerLoc: prevState.currentTravelerLoc + 0.5,
         defaultCenter: iconLoc
       }
      }
    });

  }

  //move it upward
  moveTravelerUp(){
      this.setState(prevState => {
        let iconLoc = getIconLocation(prevState.currentTravelerLoc - 0.5);
        getNearestMarker(
          iconLoc,
          this.props.markers,
          this.props.handleMarkerClick,
          this.props.handleMarkerClose
        );
        if(prevState.currentTravelerLoc - 0.5 > 0){
          return {
            currentTravelerLoc: prevState.currentTravelerLoc - 0.5,
            defaultCenter: iconLoc
          }
        }
      });
  }

  render(){
    //map center v1
    // center={mapCenters[this.props.currentMapIndex]}

    const handleMapClickWhenAuthed =
      this.props.isAuthenticated ? this.props.handleMapClick : function(){};

    if(this.props.initStateLoaded === true && this.props.initStateLoading === false){
      return (
      <div>
        <div className="row"
             onWheel={e => this.mouseScrollController(e)}>

          <BroadwayMap
            containerElement = {
              <div className= "map-container col-4" />
            }
            mapElement = {
              <div style={{ height: '100%', width: '100%' }} />
            }
            center={this.state.defaultCenter}

            linePath={longJourney}
            currentLoc={this.state.currentTravelerLoc + '%'}

            onMapClick={handleMapClickWhenAuthed}
            markers={this.props.markers}
            onMarkerClick={this.props.handleMarkerClick}
            onMarkerClose={this.props.handleMarkerClose}
            handleButtonToRemoveMarker={this.props.handleButtonToRemoveMarker}
            openForm={this.handleOpenUploadForm}

            isAuthenticated={this.props.isAuthenticated}

          />

          <UploadformContainer
            open={this.state.showUploadForm}
            closeButton={this.handleCloseUploadForm}
            location={this.state.currentUploadMarker}/>

          <PostLoadingIndicator
            isLoading={this.props.loadingPost} />

          <Minimap
            containerElement = {
              <div style={{
                  height: "250px",
                  width: "100px",
                  position: "absolute",
                  bottom: "15px",
                  left: "15px"
                 }} />
            }
            mapElement = {
              <div style={{ height: '100%', width: '100%' }} />
            }
            directions={this.state.directions}
            />

        </div>
        <Gallery
          className="col-7"
          current={this.props.currentGallery}
          handleDeletePhoto={this.props.handleDeletePhoto}
          isAuthenticated={this.props.isAuthenticated}
          />
      </div>
      )
    } else {
      return <h1>Loading...</h1>
    }
  }
}
//============ map interaction utils ============//

function getIconLocation(offset){
  const pos = window.google.maps.geometry.spherical
    .interpolate(
      new window.google.maps.LatLng(
        longJourney[0].lat,
        longJourney[0].lng
      ),
      new window.google.maps.LatLng(
        longJourney[longJourney.length-1].lat,
        longJourney[longJourney.length-1].lng
      ),
      (offset / 100)
     );
  return {lat: pos.lat(), lng: pos.lng()}
}

//markers : this.props.markers
//pos : {lat, lng}
//clickCB : this.props.handleMarkerClick
//closeCB : this.props.handleMarkerClose
function getNearestMarker(pos, markers, clickCB, closeCB){
  let nearestId;
  markers.valueSeq().forEach(marker => {
    let markerPos = marker.get('position');
    if(Math.abs(pos.lat - markerPos.lat) <= 0.002
      /*&& Math.abs(pos.lng - markerPos.lng) <= 0.002*/){
        nearestId = marker.get('id');
    } else {
      if(marker.get('showInfo')){
        let mId = marker.get('id');
        closeCB(mId);
      }
    }
  })
  if(nearestId){
    clickCB(nearestId);
  }
}

//============ api utils ============== //
//TODO: need to be separated into independent module

function postMarkerRequestApi(position){
  const id = v4();

  return (dispatch) => {
    dispatch(actionCreators.postMarker());
    axios.post('/api/markers', {
          position: position,
          id: id
    })
    .then(response => {
        Promise.all([
          dispatch(actionCreators.addMarker(position, id)),
          dispatch(actionCreators.postMarkerSuccess())
        ])
    })
    .catch(err => {
      dispatch(actionCreators.postMarkerFailure(err));
    });
  };
}

//TODO: decide to put propagate corresponding actions
function deleteMarkerRequestApi(id){
  return (dispatch) => {
    //dispatch(actionCreators.postMarker());
    axios({
      method: 'DELETE',
      url: '/api/markers',
      data: {id: id}
     })
    .then(response => {
      if(response.status == 200){
        Promise.all([
          dispatch(actionCreators.removeMarker(id)),
          //dispatch(actionCreators.postMarkerSuccess())
        ])
      }
    })
    .catch(err => {
      //dispatch(actionCreators.postMarkerFailure(err));
      console.log(err);
    });
  };
}

/*
  TODO: for periodic(automatic) fetch from server
      both markers and photos
      need to decide when to update the state from server

      options:
        1. use socket.io to listen whenever remote post happens
        2. periodic automatic update
*/
function getMarkersRequestApi(){
  return (dispatch) => {
    dispatch(actionCreators.fetchRequest());
    axios.get('/api/markers')
      .then(response => {
        console.log(response);
        //dispatch(actionCreators.fetchSuccess(response))
      })
      .catch(err => {
        dispatch(actionCreators.fetchFailure(err))
      });
  };
}

//============ photo api utils =============//
function deletePhotoRequestApi(photoId){
  return (dispatch) => {

    axios({
      method: 'DELETE',
      url: '/api/images',
      data: {id: photoId}
     })
    .then(response => {
      console.log(response)
      if(response.status === 200){
        dispatch(actionCreators.deletePhoto(photoId))
      }
    })
    .catch(err => {
      //dispatch(actionCreators.postMarkerFailure(err));
      console.log(err);
    });

  }
}


//===========================================//

function mapDispatchToProps(dispatch){
  return {
    handleMapClick: position => {
      //dispatch(actionCreators.addMarker(position))
      //dispatch(actionCreators.postMarker(position))
      dispatch(postMarkerRequestApi(position));

    },

    handleButtonToRemoveMarker: id => {
      //dispatch(actionCreators.removeMarker(id))
      dispatch(deleteMarkerRequestApi(id));
    },

    handleMarkerClick: id => {
      dispatch(actionCreators.toggleMarker(id))
    },

    handleMarkerClose: id => {
      dispatch(actionCreators.closeInfoWindow(id))
    },

    handleClickIndex: index => {
      dispatch(actionCreators.toggleMapIndex(index))
    },

    handleDeletePhoto: photoId => {
      dispatch(deletePhotoRequestApi(photoId))
    }
  }
}

function mapStateToProps(state){
  //console.log(state.get('markers').toIndexedSeq().toArray());
  return {
    markers: state.data.get('markers'),
    //markers: state.markers,
    loadingPost: state.data.get('loadingPost'),
    //loadingFetch: state.get('loadingFetch')
    currentGallery: state.data.get('currentDataForGallery'),

    currentMapIndex: state.data.get('currentMapIndex'),

    initStateLoaded: state.asyncInitialState.loaded,
    initStateLoading: state.asyncInitialState.loading,

    isAuthenticated: state.login.isAuthenticated,

    uploading: state.data.get('uploading'),
    uploadingSuccess: state.data.get('uploadingSuccess'),
    uploadingProgress: state.data.get('uploadingProgress'),
  };

}

export const MapControllerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapController);
