import React, { Component } from 'react'

import { ProgressBar } from './ProgressBar'

class Uploadform extends Component {

  constructor(props){
    super(props)
    this.state = {
      fileData: {}
    }
    this.storeFiles = this.storeFiles.bind(this)
  }

  storeFiles(files){
    this.setState({ fileData: files })
  }

  render(){
    return this.props.open && (

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
          }
          <ProgressBar
            uploading={this.props.uploading}
            uploadingProgress={this.props.uploadingProgress} />
        </div>
      )
  }
}

export default Uploadform
