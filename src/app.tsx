import React from "react";
import { createThree, CreateDetailUI } from './three'

function App() {
	React.useEffect(() => {
    createThree()
  }, [])

	return (
    <>
      <div id="three-el">
      
      </div>
      <div id="ui-container"></div>
      <div id="detail-container" style={{display: 'none'}}>
        <CreateDetailUI />
      </div>
    </>
	);
}

export default App;
