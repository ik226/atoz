import React from 'react';
import { GoogleMap ,
  withGoogleMap,
  InfoWindow,
  Marker,
  DirectionsRenderer,
  Polyline
} from 'react-google-maps';

const mapAPI = window.google.maps;

export const Minimap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{lat: 40.81173, lng: -73.960648}}
    defaultOptions={{

      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,

    }}

  >
  {props.directions && <DirectionsRenderer directions={props.directions}/>}
  </GoogleMap>
));
