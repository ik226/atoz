import React, { Component } from 'react';
//import { GoogleMap , withGoogleMap, InfoWindow, Marker } from 'react-google-maps';

import logo from './logo.svg';
import './App.css';


import { MapControllerContainer } from './components/MapController';
import { LoginContainer } from './components/Login';
//const googleMapURL = "https://maps.googleapis.com/maps/api/js?v=3.27&libraries=places,geometry&key=AIzaSyDG12UFHpFkrk-qw6gRZzZg03N3WKHOKOE"


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

    return (
      <div className="App">

        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="App-intro">
              AtoZ: Broadway
          </p>
          <p>running in <em>{process.env.NODE_ENV}</em> environment</p>
          <div style={{"display": "flex", "justify-content":"center"}}>
          <Clock />
          <button
            className="btn-primary btn-sm pull-right"
            onClick={this.handleLoginForm}>Log In</button>
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
        { this.state.showLoginForm &&
          <div style={{

            'position': 'absolute',
            'top': '0px',
            'width': '100vw',
            'height': '100vh',
            'backgroundColor': 'black',
            'opacity': '0.8'}}></div>
          }
      </div>
    );
  }
}



class Clock extends Component {
    constructor(props){
      super(props);
      /*
        'state' is used for adding fields to the class manually
        for storing something that is used for the visual
        output.
        That is, if something goes in render(), then put in state.
      */
      this.state = {date: new Date()};
    }
    /*
      setup a timer whenever the Clock is rendered to the DOM
      for the first time.
      React calls componentDidMount() lifecycle hook.
      It asks the browser to setup a timer to call tick()
      once a second.
    */
    componentDidMount(){
      this.timerID = setInterval(
        () => this.tick(), 1000
      )
    }
    /*
      clear timer whenever the DOM produced by the Clock is removed
    */
    componentWillUnmount(){
      clearInterval(this.timerID);
    }
    /*
      setState(): React kows the state has changed,
      and calls render() again to learn what should be on
      the screen.
      this.state.date is updated whenever tick() is called.

      right way to re-render component:
        don't : this.state.comment = 'hello';
        do : this.setState({ comment: 'hello' });
        asynchronous call:
          this.setState((param1, props)=> ({
           comment: param1.comment + props.comment
         }))
    */
    tick(){
      this.setState({
        date: new Date()
      });
    }

    render(){
      return (
        <div>
          <p style={{"margin":"5px"}}> current time is {this.state.date.toLocaleTimeString()}</p>
        </div>
      );
    }
};

class Toggle extends Component {
  constructor(props){
    super(props);
    this.state = {isToggleOn: true};
    /*
      bind handleClick function to 'this' scope
    */

    //this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    /*
      prevState is reference to the previous state.
      It should not be directly mutated.
      Instead, changes should be represented by building
      a new object based on the input from prevState and props.
      Here prevState == previous state
    */
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render(){
    return (
      //<button onClick = {this.handleClick}>
      <button onClick = {(e)=> this.handleClick(e)}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    )
  }
}


//setInterval(function(){console.log('this works')}, 1000);
//setInterval(App.render, 1000);

export default App;
