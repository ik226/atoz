import React, { Component } from 'react';

class MainLoading extends Component {
  constructor(props){
    super(props)
    this.state = {
      _holder: ''
    }
  }

  componentDidMount(){
    this.animation = setInterval(() => this.extend_(), 250)
  }

  componentWillUnmount(){
    clearInterval(this.animation)
  }

  extend_(){
    this.setState(prevState => { return { _holder: prevState._holder + '-' }})
  }

  render(){
    return (
      <div style={{ position: 'relative', height: '100vh', width: '100%'}}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            textAlign: 'center',
            margin: '0 auto',
            width: '100%',
            fontSize: '20px'
          }}>
          A{this.state._holder}Z
        </div>
      </div>
    )
  }
}

export default MainLoading
