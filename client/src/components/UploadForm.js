import React, { Component } from 'react';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import axios from 'axios';
import { List, fromJS } from 'immutable';

import * as actionCreators from '../actionCreators';

class UploadForm extends Component{

  constructor(props){
    super(props);
    this.state = {
      fileData: {}
    }
    this.storeFiles = this.storeFiles.bind(this);
  }

  storeFiles(files){
    this.setState({ fileData: files });
  }

  render(){
    if(this.props.open === true){

      return (

        <div className="upload-form">
          <button onClick={this.props.closeButton}>X</button>
          <div>
            <h2>Let me upload photos</h2>
            <p>current location: {this.props.location[0]}, {this.props.location[1]}</p>
          </div>
          {
            !this.props.uploading && (
              <div>
                <input id="upload-input"
                       type="file"
                       name="uploads[]"
                       multiple="multiple"
                       onChange={e => this.storeFiles(e.target.files)}/>
                <button className="upload-form-confirm-btn"
                        onClick={() => {
                         this.props.handleUpload(
                           this.props.location[2],
                           this.state.fileData
                         )}
                       }> UPLOAD </button>

              </div>
            )
          }{
            this.props.uploading && (
              <div>
                <div>progress: {this.props.uploadingProgress}%</div>
              </div>
            )
          }
        </div>
      )
    }
    return null;

  }
}

//TODO: put this into MapController.js
function postPhotosRequestApi(markerId, fileData){


  return (dispatch) => {
    if(Object.keys(fileData).length === 0) return;

    dispatch(actionCreators.uploadPhoto());

    const photoIds = [];
    const formdata = new FormData();

    //each image will be assigned photoId as their name
    for(var file of fileData){
      let newId = v4();
      formdata.append('images', file, newId );
      photoIds.push(newId);
    };

    formdata.append('photoId', photoIds);
    formdata.append('markerId', markerId);

    const config = {
      onUploadProgress: function(progressEvent){
        let percent = Math.floor((progressEvent.loaded * 100)/progressEvent.total);
        dispatch(actionCreators.uploadPhotoProgress(percent));
      }
    }
    //TODO: it works if only send formData alone, but not with other data
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
      dispatch(postPhotosRequestApi(markerId, data));
    }

  }
}

function mapStateToProps(state){
  //console.log(state.get('markers').toIndexedSeq().toArray());
  return {

    uploadingProgress: state.data.get('uploadingProgress'),
    uploading: state.data.get('uploading')
  };

}

export const UploadFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadForm);
