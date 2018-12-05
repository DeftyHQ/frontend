import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Welcome to the starter kit</h1>
        <p>This extends CRA with:</p>
        <ul>
          <li>Normalize.css</li>
          <li>Sass and CSS modules</li>
          <li>Standardjs linting</li>
        </ul>
      </div>
    );
  }
}

export default App;
