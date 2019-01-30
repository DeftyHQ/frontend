import React from 'react'
import { Grid, Paper } from '@material-ui/core'
import { Link } from 'react-router-dom'

import Routes from 'routes'
import Wallet from 'Wallet'


class Home extends React.Component {
  render() {
    return (
      <Grid item md={12}>
        <Grid item md={6}>
          <Paper>
            <Wallet />
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default Home
