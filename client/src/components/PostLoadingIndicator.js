import React, { Component } from 'react';

export const PostLoadingIndicator = (props) => {
  if(props.isLoading){
    return (
      <div className="post-loading-indicator"
           style={{
             width: "150px",
             position: "absolute",
             right: "20px",
             border: "2px solid black"
           }}>
          uploading markers..
      </div>
    )
  }
  return null;

}
