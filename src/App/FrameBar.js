import React from 'react';

import './FrameBar.css';

const FrameBar = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="Frame">
      <div className="Frame-circle Frame-circle--close"/>
      <div className="Frame-circle Frame-circle--minimise"/>
      <div className="Frame-circle Frame-circle--maximise"/>
    </div>
  )
};

export default FrameBar;
