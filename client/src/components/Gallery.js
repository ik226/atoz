import React from 'react';
import '../styles/Gallery.css'

export function Gallery(props){

  if(props.current!=null){
    const pList = props.current;
    /*
    if(!pList.size){
      return(
      <div className="gallery-no-post">
        <p>No posts yet. Please upload</p>
      </
      */
    const noPost = (<p>No posts yet. Please upload</p>)

    //var pList = props.current.toIndexedSeq().toArray();
    //console.log(pList[0].get('path'))
    const imageList = pList.map((image) => (
        <li style={{listStyleType: "none", margin: "10px 0"}}
          key={image}>
          <img src={'/tempImg/'+image} className="image"
            style={{ width: "300px"}}/>
          <div>
            <button
              className="btn"
              onClick={(e) => props.handleDeletePhoto(image)}>
              Delete
            </button>
          </div>
        </li>
      )
    );
    return(


        <div className="gallery-container container">

          {pList===0 ? {noPost} : <ul style={{padding:0}}>{imageList}</ul>}

        </div>

    );

  }
  return null;
}
