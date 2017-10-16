import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { GoogleMap , withGoogleMap, InfoWindow, Marker } from 'react-google-maps';

import logo from './logo.svg';
import './App.css';


import { MapControllerContainer } from './components/MapController';
import { LoginContainer } from './components/Login';

//temp main loading page for test
import MainLoading from './components/MainLoading'


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      showLoginForm: false
    }
    this.handleLoginForm = this.handleLoginForm.bind(this);
  }

  handleLoginForm(){
    let changed = !this.state.showLoginForm;
    this.setState({showLoginForm: changed})
  }

  render() {
    const loginBtnText = this.props.isAuthenticated ? "Log Out" : "Log In"
    if(this.props.initialStateLoading && !this.props.initStateLoaded){
      return <MainLoading />
    }
    return (
      <div>

      <div className="App">
        <div className="App-header">
          <p className="App-intro">
              AtoZ: Broadway
          </p>
          <p>running in <em>{process.env.NODE_ENV}</em> environment</p>
          <button
            className="btn-primary btn-sm pull-right"
            onClick={this.handleLoginForm}>
            {loginBtnText}</button>
          </div>
        </div>
        {
          this.state.showLoginForm &&
          <LoginContainer
            handleCloseButton={this.handleLoginForm}/>
        }
        <div className="App-map container-fluid">
          <MapControllerContainer />
        </div>
        { this.state.showLoginForm && this.isAuthenticated === false &&
          <div style={{
            'position': 'absolute',
            'top': '0px',
            'width': '100vw',
            'height': '100vh',
            'backgroundColor': 'black',
            'opacity': '0.8'}}></div>
          }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.login.isAuthenticated,
    initialStateLoaded: state.asyncInitialState.loaded,
    initialStateLoading: state.asyncInitialState.loading,
    initialStateLoadingError: state.asyncInitialState.error,
  }
}

const mapDispatchToProps = (dispatch) => {}

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
