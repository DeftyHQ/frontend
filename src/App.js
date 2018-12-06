import React from 'react'
import { Switch, Route } from 'react-router-dom'

import './App.scss'

import Header from './Header'
import Home from './Home'
import Demo from './Demo'

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/demo' component={Demo}/>
    </Switch>
  </div>
)

export default App
