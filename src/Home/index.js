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
  WalletProvider,
  CdpMarket,
  Orders,
  TradeHistory
} from 'components'

import { initNetwork } from 'store/networkAction'
import { initSystem, setCups } from 'store/makerAction'
import styles from './styles.module.css'

class Home extends React.Component {

  async selectProvider(providerType) {
    try {
      // Account 1
      // addr: 0x909f74Ffdc223586d0d30E78016E707B6F5a45E2
      // proxy: `0x1940a230BbB225d928266339e93237eD77F37b56`
      // #4832 (old)
      // #4863 (portal)
      // #4845 (graphql)

      // Kovan2
      // addr: 0xAd8fD699dFa61BF92D660A2eCD05ba612B37c0F7
      // proxy2: 0xff10e3e2f63bf07bc00d8ac298a2459e1950ef14


      await this.props.initNetwork()
      await this.props.initSystem()
      await this.props.setCups(this.props.address)


      // web3.currentProvider.publicConfigStore.on('update', async (data) => {
      //   const address = data.selectedAddress
      //   if (address !== this.props.address) {
      //     console.log('change', address, this.props.address)
      //     await this.props.getUserCups(data.selectedAddress)
      //     this.props.accountChange(address)
      //   }
      // });

    } catch (err) {
      console.warn(err)
    }
  }

  render() {
    return (
      <Grid fluid className={styles.network}>
        <Row className={styles.container}>
          <Col sm={12} md={5} lg={3}>
            <Typography variant="h5" gutterBottom>My Wallet</Typography>
            <Paper className={styles.leftBar} square>
              <WalletProvider
                hide={this.props.status === 'NETWORK_SUCCESS'}
                selectProvider={this.selectProvider.bind(this)}/>
              <Wallet
                cups={this.props.cups}
                address={this.props.address}
                network={this.props.network}
                isLoading={this.props.isCupsLoading}
               />
            </Paper>
          </Col>
          <Col sm={12} md={7} lg={9}>
            <Row>
              <Col xs={12} md={12} lg={8}>
                <Typography variant="h5" gutterBottom>CDP Market</Typography>
                <Paper square elevation={2}>
                  <CdpMarket />
                </Paper>
                <Typography variant="h5" gutterBottom>My Orders</Typography>
                <Paper square elevation={2}>
                  <Orders />
                </Paper>
              </Col>
              <Col xs={12} md={12} lg={3}>
                <Typography variant="h5" gutterBottom>Trade History</Typography>
                <Paper square elevation={2}>
                  <TradeHistory />
                </Paper>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const mapStateToProps = ({ network, maker }) => ({
  address: network.address,
  network: network.network,
  status: network.status,
  cups: maker.cups,
  maker: maker.instance,
  isCupsLoading: maker.isLoading,
})

const mapDispatchToProps = dispatch => ({
  initNetwork: () => dispatch(initNetwork()),
  initSystem: () => dispatch(initSystem()),
  setCups: (lad) => dispatch(setCups(lad))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
