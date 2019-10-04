import React from 'react';

import classNames from 'classnames';

import './Controls.css';

const Controls = ({ className, options, onUpdateOption, onSetup, onTakePhoto, recording }) => {
  const cls = classNames(
    "controls",
    className
  );

  const onChange = e => {
    let name = e.target.name;
    let value = e.target.value;

    if (e.target.type === 'checkbox') {
      value = e.target.checked;
    }

    onUpdateOption(name, value);
  };

  const getInputType = (key, { type, value }) => {
    switch (type) {
      case 'boolean':
        return <input type="checkbox" onChange={onChange} name={key} checked={value} value={value}/>;
      case 'number':
        return <input type="number" onChange={onChange} name={key} value={value}/>;
      case 'color':
        return <input type="color" onChange={onChange} name={key} value={value}/>;
      default:
        return <input type="text" onChange={onChange} name={key} value={value}/>;
    }
  };

  const renderProperty = key => {
    const { label } = options[key];

    return (
      <div key={key} className="controls-row">
        <label>
          <span>{ label }</span>
          <div>
            { getInputType(key, options[key]) }
          </div>
        </label>
      </div>
    )
  }

  return (
    <div className={ cls }>
      { Object.keys(options).map(renderProperty) }
      <div className="controls-actions">
        {
          recording ? null : (
            <p>
              Start sharing this browser tab, to allow screenshots to be taken.<br/>
              <button onClick={onSetup}>Setup</button>
            </p>
          )
        }
        {
          recording ? (
            <p>
              <button onClick={onTakePhoto}>Take screenshot</button>
            </p>
          ) : null
        }
      </div>
    </div>
  )
};

export default Controls;
