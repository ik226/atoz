import React, { Component } from 'react';
import { Circle } from 'react-google-maps';

export class Traveler extends Component {
  constructor(props){
    super(props);

  }

  render(){
    return (
    <Circle
      center={{lat: 41.078, lng: -73.858}}
      radius={100}
      options={{
        strokeColor: '#fff600',
        fillColor: '#fff600',
        fillOpacity: 1,
        zIndex: 10
      }}
    />
  )
  }
}

//temp icon obj
/*
const traveler = {
  path: window.maps.SymbolPath.CIRCLE,
  scale: 10,
  strokeColor: '#fff600'
}
*/
