import React from 'react'
import PropTypes from 'prop-types'

export const ProgressBar = (props) => {
  if (props.uploading) {
    return (
      <div>
        <div>progress: {props.uploadingProgress}%</div>
      </div>
    )
  }
  return null
}

ProgressBar.propTypes = {
  uplaoding: PropTypes.bool,
  uploadingProgress: PropTypes.number,
}
