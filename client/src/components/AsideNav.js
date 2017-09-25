import React from 'react';


export const AsideNav = props => {
  const index = ['A','B','C'];
  const indexButton = index.map((letter, i) => (
    <li key={letter}
      className="aside-nav-index"
      onClick={e => {props.clickIndex(letter.toLowerCase())}}
    ><span>{letter}</span></li>
  ));
  return (
    <div className="aside-nav col">
      <ul>
        {indexButton}
      </ul>
    </div>
  )
}
