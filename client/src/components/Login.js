import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import '../styles/Login.css';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      loginPhase: true
    }
    this.storeEmail = this.storeEmail.bind(this);
    this.storePassword = this.storePassword.bind(this);
    this.getLoginForm = this.getLoginForm.bind(this);
    this.togglePhase = this.togglePhase.bind(this);

  }

  storeEmail(username){
    this.setState({ username: username });
    console.log(this.state);
  }

  storePassword(pw){
    this.setState({ password: pw });
    console.log(this.state);
  }

  getLoginForm(){
    return {username: this.state.username, password: this.state.password};
  }

  togglePhase(){
    this.setState(prevState => {
      return { loginPhase: !prevState.loginPhase };
    })
  }


  render(){
    const st = this.state.loginPhase;
    let toggleBtnLabel = st ? "Sign-up" : "Log-in" ;
    let currentBtnLabel = st ? "Log In" : "Sign Up" ;
    let status = st ? "Don't have ID? " : "Already a member? ";
    return (

        <div className="login-form modal container">
          <div className="row padding-15">
            <div className="col-8">
            <button type="button" className="close"
              aria-label="Close"
              onClick={this.props.handleCloseButton}>
              <span aria-hidden="true">&times;</span>
            </button>
            <br />
            <h5>{currentBtnLabel}</h5>
            <div className="input-group">
              <span className="input-group-addon" id="input-email-addon">email</span>
              <input type="text"
                onChange={(e) => {this.storeEmail(e.target.value)}}
                className="form-control"
                placeholder="your email"
                aria-label="email placeholder"
                aria-describedby="input-email-addon" />
            </div>
            <br />
            <div className="input-group">
              <span className="input-group-addon" id="input-pw-addon">password</span>
              <input type="password"
                onChange={(e)=>{this.storePassword(e.target.value)}}
                className="form-control"
                placeholder="your password"
                aria-label="pw placeholder"
                aria-describedby="input-pw-addon" />
            </div>
            <br />
            <p>{status} <a onClick={this.togglePhase}>{toggleBtnLabel}</a></p>
            <button
                onClick={

                    (e) => this.state.loginPhase ?
                      this.props.loginRequest(this.getLoginForm()) :
                      this.props.signInRequest(this.getLoginForm())

                }
                className="btn-lg pull-right">{currentBtnLabel}</button>

            </div>
          </div>
        </div>

    )
  }
}

function loginRequestApi(input){
  return dispatch => {
    console.log(typeof input)
    //TODO: do dispatch action of starting request
    //dispatch(actionCreators.startLogin)
    axios.post('/auth/login', input)
      .then(response => {
        if(response.status === 200){
          //TODO:
          //dispatch(actionCreators.loginSuccess)
          console.log(response)
        }
      })
      .catch(err => {
        console.log(err);
      });

  };
};

function signInRequestApi(input){
  return dispatch => {
    console.log(input);
    axios.post('/auth/signup', input)
      .then(response => {
        if(response.status === 200){
          console.log(response);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function mapDispatchToProps(dispatch){
  return {
    loginRequest: input => {
      dispatch(loginRequestApi(input))
      //loginRequestApi(dispatch, input)
    },
    signInRequest: input => {
      dispatch(signInRequestApi(input))
    }
  }
}

function mapStateToProps(){

}


export const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
