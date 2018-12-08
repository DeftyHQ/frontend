export { default as configureStore } from './store'

/*
Demo use of redux, react-redux, redux-thunk middleware

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { simpleAction } from 'store/simpleAction';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
  return (
   <div className="App">
    <header className="App-header">
     <img src={logo} className="App-logo" alt="logo" />
     <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
     To get started, edit <code>src/App.js</code> and save to reload
    </p>
   </div>
  );
  }
}

const mapStateToProps = state => ({
  ..state
})

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

*/
