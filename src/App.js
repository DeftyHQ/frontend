import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import Header from './Header'
import Routes from './routes'

import styles from './App.module.css'

class App extends React.Component {
  
  render() {
    return (
      <div className={styles.root}>
        <Header />
        <Switch>
          <Route exact path={Routes.root.path} component={Routes.root.component}/>
          <Route exact path={Routes.home.path} component={Routes.home.component}/>
        </Switch>
      </div>
    )
  }
}


export default App
