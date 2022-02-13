import React, {useRef, useEffect} from 'react';
import './reset.css';
import './App.css';

import {UncontrolledReactSVGPanZoom} from 'react-svg-pan-zoom';

function MakeSVG(props) {
  const Viewer = useRef(null);

  useEffect(() => {
    Viewer.current.fitToViewer();
  }, []);

  return (
      <UncontrolledReactSVGPanZoom
        ref={Viewer}
        width={750} height={750}
        onZoom={e => console.log('zoom')}
        onPan={e => console.log('pan')}
        onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
        tool={"auto"}
        background={"#fff"}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {props.inner}
        </svg>
      </UncontrolledReactSVGPanZoom>
  )
}

class ScatterPlot extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      docs: null,
      docid: -1
    }
  }

  componentDidMount() {
  }

  handleChangeDocument(value) {
    this.setState({
      docid: value
    });
  }

  handleFileUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      this.setState({
        docs: JSON.parse(e.target.result)
      });
    };
  }

  render() {

    let points = null;
    if (this.state.docs)
    {
      console.log(this.state.docs);

      points = this.state.docs.map((obj, i) => {
        return (
          <circle
            cx={obj.v1 * 100}
            cy={obj.v2 * 100}
            r={obj.size}
            fill={obj.color}
            key={i}
            onMouseOver={() => this.handleChangeDocument(i)}
            />);
      });

      points = (
        <MakeSVG
          inner={points}
        />
      );
    }

    let upload = (
      <div className="file-loader">
        <label className="button" htmlFor="upload">Upload JSON File</label>
        <input id="upload" type="file" onChange={this.handleFileUpload} />
      </div>
    );

    let text = null;
    let meta = null;
    if (this.state.docid > -1)
    {
      text = this.state.docs[this.state.docid].text;
      meta = this.state.docs[this.state.docid].meta[0]['doc_id'];
    }

    return (
      <div className={"vis-container"}>
        {upload}
        <div className={"vis-container-inner"}>
          {points}
        </div>
        <div className={"vis-text"}>
          <span><b>{meta}</b></span>
          <p>{text}</p>
        </div>
      </div>
    )
  }
}

// ***************************************************************************
// Wrap the App and return the rendered Viewer

function App() {
  return (
    <ScatterPlot />
  );
}

export default App;
