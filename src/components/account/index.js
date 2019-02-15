import React from 'react'
import { Typography } from '@material-ui/core'

import { EthAddress } from 'components'
import { getJazziconIcon } from 'utils/helpers'
import styles from './styles.module.css'


const Account = ({ address, network }) => (
  <div className={styles.root}>
    { getJazziconIcon(address, 36) }
    <div className={styles.account}>
      <Typography>{network}</Typography>
      <EthAddress address={address} />
    </div>
  </div>
)

export default Account
