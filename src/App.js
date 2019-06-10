import React from 'react';
import './App.css';
import AutoCompleteSearch from './Autocomplete';

function App() {
  return (
    <div className="App">
      <header className="row App-header">
        <h3 className="col-sm-3 App-title" alt="title">Personal Capital</h3>
        <h4 className="col-sm-8" style={{textAlign:"right", paddingTop:"5px"}}>Product Catalog</h4>
      </header>
      <div id="App-content" className="App-body" style={{ height: '85%'}}>
        <AutoCompleteSearch/>
      </div>
      <footer className="App-footer" style={{height: '5%', background:'#282c34'}}>

      </footer>
    </div>
  );
}

export default App;
