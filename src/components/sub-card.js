import React from 'react';

function SubCard(props) {
  return (
    <div className='card border-primary mb-3'>
      <div className='card-header'>{props.title}</div>
      <div className='card-body'>{props.children}</div>
    </div>
  );
}

export default SubCard;
