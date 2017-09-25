import React, { Component } from 'react';
import axios from 'axios';

/*
  props:
    hasPhotos
    position
    numPhotos
*/
/*export const InfoContent = props => {

    return (
      <div>
        <div>
          <span style={{color: (props.numPhotos===0)? '#ff0000' : '#000000'}}>
            {props.numPhotos}
          </span> posted
        </div>
        <div>
          <h3>Current Location</h3>
          <p>
  Lat: {Number(props.position.lat).toFixed(3)} , Lng: {Number(props.position.lng).toFixed(3)}
          </p>
        </div>
      </div>
    );

}
*/
export class InfoContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      address: ''
    }
    //this.setAddress = this.setAddress.bind(this);
  }

  componentWillMount(){
    /*
    const baseURL = 'https://maps.googleapis.com/maps/api/geocode/json?'
    const latLng = 'latlng=' + this.props.position.lat + ','
                      + this.props.position.lng;
    const apiKey = 'AIzaSyDG12UFHpFkrk-qw6gRZzZg03N3WKHOKOE';
    console.log(baseURL + latLng + apiKey);
    axios(baseURL + latLng + apiKey)
      .then(response => { console.log(response[0].formatted_address); })
      .catch(err => { console.log(err); });
  */
    let geoCodePromise = new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = {
        lat: Number(this.props.position.lat),
        lng: Number(this.props.position.lng)
      };
      geocoder.geocode({'location': latlng}, function(results, status){
        if(status === 'OK'){
          //console.log(results[0].formatted_address);
          const addr = results[0].formatted_address
          resolve(addr);
        }
        else {
          //console.log('error in geocode')
          reject(status)
        }
      });
    });
    geoCodePromise
      .then(success => {
        console.log(success);
        this.setState({address: success});
      })
      .catch(err => console.log(err));


  }

  render(){
    const loadingPhase = (
      <p>loading...</p>
    )
    return (
      <div>
        <div>
          <span style={{color: (this.props.numPhotos===0)? '#ff0000' : '#000000'}}>
            {this.props.numPhotos}
          </span> posted
        </div>
        <br />
        <div>
          {this.state.address !== '' ? <p>{this.state.address}</p> : loadingPhase }

        </div>
      </div>
    );
  }
}
