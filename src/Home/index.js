import React from 'react'
import { connect } from 'react-redux'
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

import { getWeb3 } from 'api'
import { initWeb3 } from 'store/web3Action'
import { initMaker, getCups } from 'store/makerAction'
import styles from './styles.module.css'

import Maker from '@makerdao/dai'

class Home extends React.Component {
  async getAccounts(web3) {
    const accounts = await web3.eth.getAccounts()
    return {
      web3,
      accounts,
      network: await web3.eth.net.getNetworkType(),
      address: accounts[0]
    }
  }

  async selectProvider(providerType) {
    try {
      const web3 = await getWeb3()
      const auth = await this.getAccounts(web3)
      await this.props.initWeb3(auth)
      await this.props.initMaker()

      const { maker, account} = this.props
      const proxy = await maker.service('proxy').getProxyAddress()
      await this.props.getCups(account, proxy)
      console.log(this.props.cups)
      // const p1 = await maker.service('proxy').getProxyAddress()
      // const p2 = await maker.service('proxy').currentProxy()

      // const cdp = await this.props.getCups(auth.address, p1)
      // console.log(p1, p2, cdp)
      // const cups = this.props.cups.map(async (cup) => {
      //   const c = await maker.getCdp(cup.id)
      //   const debt = await c.getDebtValue()
      //   const debt2 = await c.getDebtValue(Maker.USD)
      //   const col = await c.getCollateralizationRatio()
      //   const col2 = await c.getLiquidationPrice()
      //   const col3 = await c.getCollateralValue()
      //   const ratio = await c.isSafe();
      //   console.log(debt, debt2.toString(), col, col2.toString(), col3.toString(), ratio)
      // })
      // console.log(cups)
    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    return (
      <Grid fluid className={styles.root}>
        <Row className={styles.container}>
          <Col xs={12} sm={4} md={4} lg={3}>
            <Typography variant="h5" gutterBottom>My Wallet</Typography>
            <Paper className={styles.leftBar} square>
              <WalletProvider
                hide={this.props.status === 'AUTH_SUCCESS'}
                selectProvider={this.selectProvider.bind(this)}/>
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
}

const mapStateToProps = ({ auth, maker }) => ({
  account: auth.address,
  status: auth.status,
  cups: maker.cups,
  maker: maker.instance
})

const mapDispatchToProps = dispatch => ({
  initWeb3: (auth) => dispatch(initWeb3(auth)),
  initMaker: () => dispatch(initMaker()),
  getCups: (address, proxy) => dispatch(getCups(address, proxy))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
