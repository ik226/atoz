import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props){
    super(props);

  }
  render(){
    return (
      <div>
        <form>
          <input type="text" />
          <button> search </button>
        </form>
      </div>
    )
  }
}
