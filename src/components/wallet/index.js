import React from 'react'

import {
  Modal,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Typography
} from '@material-ui/core'

import {
  Account,
  WrapSteps,
  CupPanel,
} from 'components'

import styles from './styles.module.css'

class Wallet extends React.Component {
  state = {
    unWrapOpen: false,
    modalOpen: false,
    modalCup: null,
  }

  handleUnWrap(cup) {
    this.setState({
      unWrapOpen: true,
      modalCup: cup,
    });
  };

  handleUnWrapClose() {
    this.setState({ unWrapOpen: false })
  }

  handleOpen(cup) {
    this.setState({
      modalOpen: true,
      modalCup: cup,
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
      <CupPanel key={index} cup={nft} index={index} action={this.handleUnWrap.bind(this)} actionTitle={'UnWrap'}/>
    ))
  }

  render() {
    const { cups, nfts, address, network, isLoading, unWrap } = this.props
    return (
      <div className={styles.fullHeight}>
        <Account address={address} network={network}/>
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
        {/*To Wrap*/}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modalOpen}
          onClose={this.handleClose.bind(this)}
          style={{ display: 'flex', alignItems:'center', justifyContent:'center' }}>
          <WrapSteps
            cup={this.state.modalCup}
            onComplete={this.handleClose.bind(this)}/>
        </Modal>
        {/*To UnWrap*/}
        <Modal
          open={this.state.unWrapOpen}
          onClose={this.handleUnWrapClose.bind(this)}
          style={{ display: 'flex', alignItems:'center', justifyContent:'center' }}>
          <Paper className={styles.unwrap}>
            <Typography variant="h6" id="modal-title" gutterBottom>
               CDP #{this.state.modalCup ? this.state.modalCup.cupData.id : ''}
            </Typography>
            <Typography>This action will cancel all open trades for this CDP.</Typography>
            <Typography>If you want to trade this CDP in the future you will need to wrap it again.</Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={async () => {
                await unWrap(this.state.modalCup)
                this.handleUnWrapClose()
              }}>
              UnWrap
            </Button>
          </Paper>
        </Modal>
      </div>
    )
  }
}


export default Wallet
