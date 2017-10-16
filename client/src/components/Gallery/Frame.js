import React from 'react'
import PropTypes from 'prop-types'

// holder for each data entry that will be featured inside Gallery
export const Frame = (props) => {
  // TODO: let Frame treat each data differently based on their type.
  // possible types: image, text, video...
  return (
  <div>
  { props.isAuthenticated && (
    <button
      type='button'
      className='close'
      onClick={e => props.handleDeletePhoto(props.dataId)}>
      &times;
    </button> )
  }
    <img src={`/tempImg/${props.dataId}`} className='image'
      style={{ width: '300px'}}/>
  </div>
)}

Frame.PropTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  dataId: PropTypes.string.isRequired,
  handleDeletePhoto: PropTypes.func.isRequired,
}
