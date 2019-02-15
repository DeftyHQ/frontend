import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

import { EthAddress } from 'components'
import { getJazziconIcon } from 'utils/helpers'
import styles from './styles.module.css'


const Account = ({ address = '', network = '' }) => (
  <div className={styles.root}>
    { getJazziconIcon(address, 36) }
    <div className={styles.account}>
      <EthAddress address={address} />
      <Typography variant="caption" className={styles.alignLeft}>{network}</Typography>
    </div>
  </div>
)

Account.propTypes = {
  address: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
}

export default Account
