import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

export class InfoContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      address: ''
    }
  }

  componentWillMount(){
    // get readable address from Google map geocode api
    let geoCodePromise = new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = {
        lat: Number(this.props.position.lat),
        lng: Number(this.props.position.lng)
      }

      geocoder.geocode({'location': latlng}, function(results, status){
        if(status === 'OK'){
          const addr = results[0].formatted_address
          resolve(addr);
        }
        else {
          reject(status)
        }
      })
    })

    geoCodePromise
      .then(success => {
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
          <span style={{color: (this.props.numPhotos === 0) ? '#ff0000' : '#000000'}}>
            {this.props.numPhotos}
          </span> posted
        </div>
        <br />
        <div>
          { this.state.address !== '' ? <p>{this.state.address}</p> : loadingPhase }
        </div>
      </div>
    );
  }
}

InfoContent.PropTypes = {
  numPhotos: PropTypes.num,
  position: PropTypes.Object,
  isAuthenticated: PropTypes.bool,
}
