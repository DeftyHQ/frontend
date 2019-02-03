import React from 'react'
import Blockies from 'react-blockies'
import { Typography } from '@material-ui/core'

import EthAddress from 'lib/react-eth-address'
import styles from './styles.module.css'


const Account = ({ address, network }) => (
  <div className={styles.root}>
    <Blockies className={styles.rounded} seed={address} />
    <div>
      <Typography>{network}</Typography>
      <EthAddress address={address} />
    </div>
  </div>
)

export default Account
