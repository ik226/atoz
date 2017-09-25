import React, { Component } from 'react';
import { GoogleMap ,
  withGoogleMap,
  InfoWindow,
  Marker,
  DirectionsRenderer,
  Polyline
} from 'react-google-maps';
import MapStyles from '../MapStyles.json';
import { InfoContent } from './InfoContent';
//import { Traveler } from './Traveler';


export const BroadwayMap = withGoogleMap(props => (
  //{props.directions && <DirectionsRenderer directions={props.directions}/>}
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={13}
    center={props.center}
    defaultOptions={{
      styles: MapStyles,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    }}

    onClick={e => {
      props.onMapClick(
        {lat: e.latLng.lat(), lng: e.latLng.lng()}
      )
    }}
  >
    <Polyline
      path={props.linePath}
      options={{

        strokeColor: "#00ffff",
        icons:
        [
          {
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              strokeColor: 'yellow'
            },
            offset: props.currentLoc
          }
        ]


  }}  />


    {
      props.markers.toIndexedSeq().toArray().map(marker => {
        const id = marker.get('id');
        const pos = marker.get('position');

        return(
        <Marker
          {...marker}
          position={marker.get('position')}
          key={id}
          onClick={() => {props.onMarkerClick(id)}}
        >
          {
            marker.get('showInfo') && (
              <InfoWindow onCloseClick={() => props.onMarkerClose(id)}>
                <div>
                  <InfoContent
                      hasPhotos={marker.get('hasPhotos')}
                      position={marker.get('position')}
                      numPhotos={marker.get('photos').toArray().length}/>
                  <button onClick= {() => props.handleButtonToRemoveMarker(id)}>
                    Remove Marker
                  </button>
                  <button
                    className="upload-button"
                    onClick={() => props.openForm(marker)}
                  >Upload Photo</button>
                </div>
              </InfoWindow>
            )}

        </Marker>
      );
    })
  }
  </GoogleMap>
));
