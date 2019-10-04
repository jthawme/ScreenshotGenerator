import React, { useState, useReducer, useRef } from 'react';
import { saveAs } from 'file-saver';

import classNames from 'classnames';

import Controls from '../Controls/Controls';
import FrameBar from './FrameBar';

import './App.css';

const initialState = {
  url: {
    label: 'Site URL',
    value: 'https://friendsofkerouac.com'
  },
  width: {
    label: 'Width',
    type: 'number',
    value: 1920
  },
  height: {
    label: 'Height',
    type: 'number',
    value: 1080
  },
  zoom: {
    label: 'Zoom',
    type: 'number',
    value: 0.5
  },
  appColor: {
    label: 'Background',
    type: 'color',
    value: '#cccccc'
  },
  frameColor: {
    label: 'Site Background',
    type: 'color',
    value: '#ffffff'
  },
  frame: {
    label: 'In frame',
    type: 'boolean',
    value: true
  },
  rounded: {
    label: 'Rounded edge',
    type: 'boolean',
    value: true
  },
  delay: {
    label: 'Screenshot Delay Timer',
    type: 'number',
    value: 250
  },
  filePrefix: {
    label: 'File Name',
    value: 'image'
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          value: action.value
        }
      }
    default:
      return state;
  }
}

const getStyles = ({ appColor, width, height, zoom, frameColor }) => {
  return {
    app: {
      backgroundColor: appColor.value
    },
    content: {
      width: `${ width.value }px`,
      height: `${ height.value }px`,
      transform: `scale(${ zoom.value })`
    },
    wrapper: {
      paddingBottom: `${ (height.value / width.value) * 100 }%`
    },
    frame: {
      backgroundColor: frameColor.value
    }
  };
}

const saveImage = (name, img) => {
  const canvas = new OffscreenCanvas(img.videoWidth, img.videoHeight);
  const ctx = canvas.getContext('2d');

  // ctx.drawImage(img, 0, 0, img.width, img.height);
  ctx.drawImage(img, 0, 0, img.videoWidth, img.videoHeight);

  canvas.convertToBlob({
    type: 'image/jpeg',
    quality: 1
  })
    .then(blob => saveAs(blob, name));
}

function App() {
  const videoRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [hideControls, setHideControls] = useState(false);
  const [stream, setStream] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const startRecording = () => {
    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "never"
      }
    })
      .then(stream => {
        videoRef.current.srcObject = stream;

        stream.addEventListener('inactive', e => {
          stopRecording();
        });

        setStream(stream);
        setRecording(true);
      });
  }

  const takePhoto = () => {
    setTimeout(() => {
      saveImage(`${ getValue(state.filePrefix) }.jpg`, videoRef.current);
      setHideControls(false);
    }, getValue(state.delay));

    setHideControls(true);
  };

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }

    setHideControls(false);
    setRecording(false);
    setStream(false);
  };

  const onUpdateOption = (key, value) => {
    dispatch({ type: 'update', key, value });
  };

  const getValue = ({ value }) => value;

  const styles = getStyles(state);

  const cls = classNames(
    'App',
    {
      'App--rounded': getValue(state.rounded)
    },
    {
      'App--no-controls': hideControls
    }
  )

  return (
    <div className={ cls } style={styles.app}>
      <video className="App-video" ref={videoRef} autoPlay/>

      <Controls
        className="App-controls"
        options={state}
        onUpdateOption={onUpdateOption}
        onSetup={startRecording}
        recording={recording}
        onTakePhoto={takePhoto}/>

      <div className="App-content" style={styles.content}>
        <div className="App-frame-wrapper" style={styles.wrapper}>
          <FrameBar show={getValue(state.frame)}/>

          <iframe title={getValue(state.url)} src={getValue(state.url)} className="App-frame" frameBorder="0" style={styles.frame}/>
        </div>
      </div>
    </div>
  );
}

export default App;
