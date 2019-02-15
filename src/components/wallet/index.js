import React from 'react'

import {
  Modal,
  Divider,
  CircularProgress,
  Typography
} from '@material-ui/core'

import {
  Account,
  CupPanel,
  StepsWrap,
  StepsUnWrap,
} from 'components'

import { CUP_TYPES } from 'store/makerAction'
import styles from './styles.module.css'

class Wallet extends React.Component {
  state = {
    modalOpen: false,
    modalCup: {},
  }

  handleOpen(cup) {
    this.setState({
      modalCup: cup,
      modalOpen: true,
    });
  };

  handleClose() {
    this.setState({ modalOpen: false });
  }

  displayCups(cups) {
    return cups.map((cup, index) => (
      <CupPanel key={index} cup={cup} index={index} action={this.handleOpen.bind(this)} actionTitle={'Wrap'}/>
    ))
  }

  displayNFTs(nfts) {
    return nfts.map((nft, index) => (
      <CupPanel key={index} cup={nft} index={index} action={this.handleOpen.bind(this)} actionTitle={'UnWrap'}/>
    ))
  }

  displayModalContent(cup) {
    const { unWrap } = this.props

    if (cup.type === CUP_TYPES.WRAPPED) {

      // @TODO decide if its better to have connection to store.
      return (
        <StepsUnWrap
          cup={cup}
          onClick={async () => {
            await unWrap(this.state.modalCup)
            this.handleClose() }} />
      )
    } else {
      return (
        <StepsWrap
          cup={this.state.modalCup}
          onComplete={this.handleClose.bind(this)} />
      )
    }
  }

  render() {
    const { cups, nfts, address, network, isLoading } = this.props
    return (
      <div className={styles.fullHeight}>
        <Account
          address={address}
          network={network}/>
        <section className={styles.stretch}>
          <div className={styles.listHeader}>
            <Typography variant="subtitle1">My CDP's</Typography>
          </div>
          <Divider />
          <div className={styles.stretch}>
            {
              isLoading
              ? <div className={styles.progress}>
                  <CircularProgress />
                </div>
              : <div className={styles.listBody}>
                  { this.displayCups(cups) }
                </div>
            }
          </div>
          <div className={styles.listHeader}>
            <Typography variant="subtitle1">My NFT's</Typography>
          </div>
          <Divider />
          <div className={styles.listBody}>
            { this.displayNFTs(nfts) }
          </div>
        </section>

        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose.bind(this)}
          style={{ display: 'flex', alignItems:'center', justifyContent:'center' }}>
          { this.displayModalContent(this.state.modalCup) }
        </Modal>
      </div>
    )
  }
}


export default Wallet
