import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import {
  Paper,
  Typography,
} from '@material-ui/core'

import Routes from 'routes'
import {
  Wallet,
  WalletProvider
} from 'components'

import styles from './styles.module.css'

class Home extends React.Component {
  render() {
    return (
      <Grid fluid className={styles.root}>
        <Row className={styles.container}>
          <Col xs={12} sm={4} md={4} lg={3}>
            <Typography variant="h5" gutterBottom>My Wallet</Typography>
            <Paper className={styles.leftBar} square>
              <WalletProvider hide={false} />
              <Wallet />
            </Paper>
          </Col>
          <Col xs={12} sm={8} md={8} lg={9}>
            <Row>
              <Col xs={12} md={12} lg={9}>
                <Typography variant="h5" gutterBottom>CDP Market</Typography>
                <Paper>Something</Paper>
                <Typography variant="h5" gutterBottom>My Orders</Typography>
                <Paper>Something</Paper>
              </Col>
              <Col xs={12} md={12} lg={3}>
                <Typography variant="h5" gutterBottom>Trade History</Typography>
                <Paper>Something</Paper>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    )
  }
  // render() {
  //   return (
  //     <Grid
  //       className={styles.root}
  //       container
  //       spacing={8}
  //       direction="row">
  //       <Grid item xs={12} md={4} lg={3} spacing={24}>
  //         <div className={`full-height ${styles.leftBar}`}>
  //           <Typography variant="h5" gutterBottom>My Wallet</Typography>
  //           <Paper className={`full-height`}>
  //             <Wallet />
  //           </Paper>
  //         </div>
  //       </Grid>
  //       <Grid item xs={12} md={4} lg={4}>
  //         <div>
  //           <Typography variant="h5" gutterBottom>CDP Market</Typography>
  //           <Paper>Something</Paper>
  //         </div>
  //         <div>
  //           <Typography variant="h5" gutterBottom>My Orders</Typography>
  //           <Paper>Something</Paper>
  //         </div>
  //       </Grid>
  //     </Grid>
  //   )
  // }
}

export default Home
