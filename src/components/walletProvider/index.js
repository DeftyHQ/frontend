import React from 'react'
import {
  Typography,
  Button,
} from '@material-ui/core'

import metamaskSVG from './metamask.svg'
import ledgerSVG from './ledger.svg'
import trezorSVG from './trezor.svg'
import styles from './styles.module.css'

class WalletProvider extends React.Component {
  render() {
    const { hide, selectProvider } = this.props
    if (hide) { return null }
    return (
      <div className={styles.providerOptions}>
        <Typography className={styles.instructions} variant="caption" gutterBottom>
          Get started by connecting a wallet.
        </Typography>
        <div className={styles.provider}>
          <Button
            fullWidth
            className={styles.providerAction}
            onClick={() => {
              selectProvider('MetaMask')
            }}>
            <img src={metamaskSVG} className={styles.providerIcon}></img>
            MetaMask
          </Button>
        </div>
        <div className={`${styles.provider} ${styles.disabled}`}>
          <Button
            disabled
            fullWidth
            className={styles.providerAction}
            onClick={() => selectProvider('Ledger')}>
            <img src={ledgerSVG} className={styles.providerIcon}></img>
            <Typography>Ledger Nano S</Typography>
          </Button>
        </div>
        <div className={`${styles.provider} ${styles.disabled}`}>
          <Button
            disabled
            fullWidth
            className={styles.providerAction}
            onClick={() => selectProvider('Trezor')}>
            <img src={trezorSVG} className={styles.providerIcon}></img>
            <Typography>Trezor</Typography>
          </Button>
        </div>
      </div>
    )
  }
}

export default WalletProvider
