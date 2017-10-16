import React from 'react'
import PropTypes from 'prop-types'
import './styles/Gallery.css'

//components
import { Frame } from './Frame'

export const Gallery = (props) => {

  if(props.current !== null){
    // array of data ids
    const pList = props.current
    //TODO: more functionalities and elements for no post
    const noPost = (<p>No posts yet. Please upload</p>)

    const imageList = pList.map((dataId) => (
        <li style={{display: 'flex', listStyleType: 'none', margin: '10px 0'}}
          key={dataId}>
          <Frame
            dataId={dataId}
            handleDeletePhoto={props.handleDeletePhoto}
            isAuthenticated={props.isAuthenticated} />
        </li>
      ))

    return(
      <div className='gallery-container container'>
        { pList.size === 0 ? noPost : <ul style={{padding:0}}> {imageList} </ul> }
      </div>

    );

  }
  return null;
}
Gallery.PropTypes = {
  current: PropTypes.array.isRequired,
  handleDeletePhoto: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
}
