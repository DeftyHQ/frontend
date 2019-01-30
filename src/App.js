import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import Header from './Header'
import Routes from './routes'

import './App.scss'

class App extends React.Component {
  async componentDidMount() {
    // First run ask for Metamask authorization
    // - we should load the page before asking
    // - also it will not work on address or network change so we should
    // create an action that can be dispatched at the appropriate moment.
    // const web3 = await getWeb3()
    // const accounts = await web3.eth.getAccounts()
    // const currentAddress = accounts[0]

    // const data = getCups(currentAddress)
    //   .then((data) => {
    //       console.log('data', data)
    //     })
  }

  render() {
    return (
      <div>
        <Header />
        <Grid
          container
          spacing={8}
          direction="row">
          <Switch>
            <Route exact path={Routes.root.path} component={Routes.root.component}/>
            <Route exact path={Routes.home.path} component={Routes.home.component}/>
            <Route exact path={Routes.demo.path} component={Routes.demo.component}/>
          </Switch>
        </Grid>
      </div>
    )
  }
}


export default App
