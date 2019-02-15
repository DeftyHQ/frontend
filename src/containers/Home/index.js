import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid'
import {
  Paper,
  Typography,
} from '@material-ui/core'

import {
  Wallet,
  WalletProvider,
  CdpMarket,
  Orders,
  TradeHistory
} from 'components'

import { initNetwork } from 'store/networkAction'
import { initSystem, setCups } from 'store/makerAction'
import { unWrap } from 'store/deftyAction'
import styles from './styles.module.css'

class Home extends React.Component {

  async selectProvider(providerType) {

    try {
      await this.props.initNetwork()
      await this.props.initSystem(window)
    } catch (err) {
      console.warn('selectProvider Error', err)
    }
    try {
      await this.props.setCups(this.props.address, window)
    } catch (err) {
      console.debug('setCups in selectProvider Error', err)
    }
    // @TODO: Listen to account and network change
    // web3.currentProvider.publicConfigStore.on('update', async (data) => {
    //   const address = data.selectedAddress
    //   if (address !== this.props.address) {
    //     console.log('change', address, this.props.address)
    //     await this.props.getUserCups(data.selectedAddress)
    //     this.props.accountChange(address)
    //   }
    // });
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
                nfts={this.props.nfts}
                address={this.props.address}
                network={this.props.networkName}
                isLoading={this.props.isCupsLoading}
                unWrap={this.props.unWrap}
               />
            </Paper>
          </Col>
          <Col sm={12} md={7} lg={9}>
            <Row>
              <Col xs={12} md={12} lg={7}>
                <Typography variant="h5" gutterBottom>CDP Market</Typography>
                <Paper square elevation={2}>
                  <CdpMarket />
                </Paper>
                <Typography variant="h5" gutterBottom>My Orders</Typography>
                <Paper square elevation={2}>
                  <Orders />
                </Paper>
              </Col>
              <Col xs={12} md={12} lg={5}>
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
  networkName: network.networkName,
  status: network.status,
  cups: maker.cups,
  nfts: maker.nfts,
  isCupsLoading: maker.isLoading,
})

const mapDispatchToProps = dispatch => ({
  initNetwork: () => dispatch(initNetwork()),
  initSystem: (window) => dispatch(initSystem(window)),
  setCups: (lad, window) => dispatch(setCups(lad, window)),
  unWrap: (cup) => dispatch(unWrap(cup)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
