import React from 'react';
import '../styles/Gallery.css'

export function Gallery(props){

  if(props.current!=null){
    const pList = props.current;
    console.log(pList)
    if(!pList.size){
      return(
      <div className="gallery-no-post">
        <p>No posts yet. Please upload</p>
      </div>)
    }
    //var pList = props.current.toIndexedSeq().toArray();
    //console.log(pList[0].get('path'))
    const imageList = pList.map((image) => (
        <li style={{listStyleType: 'none', margin: "20px 0"}}
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
          <ul>
          {imageList}
          </ul>
        </div>

    );

  }
  return null;
}
