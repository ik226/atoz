import React, { Component } from 'react'
import { connect } from 'react-redux'
import { v4 } from 'uuid'
import axios from 'axios'
import { List, fromJS } from 'immutable'

//Component
import Uploadform from './Uploadform'

import * as actionCreators from '../../actionCreators'

// post files to server
function postPhotosRequestApi(markerId, fileData){
  return (dispatch) => {
    if(Object.keys(fileData).length === 0) return

    dispatch(actionCreators.uploadPhoto())

    const photoIds = []
    const formdata = new FormData()

    //each image will be assigned photoId as their name
    for(var file of fileData){
      let newId = v4()
      formdata.append('images', file, newId )
      photoIds.push(newId)
    }

    formdata.append('photoId', photoIds)
    formdata.append('markerId', markerId)

    const config = {
      onUploadProgress: function(progressEvent){
        let percent = Math.floor((progressEvent.loaded * 100)/progressEvent.total)
        dispatch(actionCreators.uploadPhotoProgress(percent))
      }
    }
    axios.post('api/images', formdata, config)
      .then(response => {
        Promise.all([
          dispatch(actionCreators.uploadPhotoSuccess()),
          dispatch(actionCreators.addPhoto(markerId, photoIds))
        ])
      })
      .catch(err => console.log(err)) //TODO: call uploadPhotoFailure
  }

}


function mapDispatchToProps(dispatch){
  return {

    handleUpload: (markerId, data) => {
      dispatch(postPhotosRequestApi(markerId, data))
    }

  }
}

function mapStateToProps(state){
  return {
    uploadingProgress: state.data.get('uploadingProgress'),
    uploading: state.data.get('uploading'),
    uploadingSuccess: state.data.get('uploadingSuccess'),
  }

}

export const UploadformContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Uploadform)
