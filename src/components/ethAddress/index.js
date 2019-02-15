import React from 'react'
import { Typography, Grid } from '@material-ui/core'
import CopyIcon from '@material-ui/icons/FileCopyOutlined'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'

import styles from './styles.module.css'

class EthAddress extends React.Component {
  state = { isHidden: true }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onClick() {
    copy(this.props.address);
    this.showCopied();
  }

  showCopied() {
    this.setState({ isHidden: false });
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.hideCopied.bind(this), 1000)
  }

  hideCopied() {
    this.setState({ isHidden: true });
  }

  render() {
    const { address } = this.props
    const { isHidden } = this.state
    const displayAddress = `${address.substr(0, 6)}....${address.substr(38, 42)}`

    return (
      <span className={`${styles.root} ${styles.copyEnabled}`} onClick={this.onClick.bind(this)}>
        <Grid container alignItems="center" alignContent="center">
          <Grid item>
            <Typography variant="body1" inline>
            {displayAddress}
            </Typography>
          </Grid>
          <Grid item>
            <CopyIcon className={styles.copyIcon}/>
          </Grid>
        </Grid>
        {
          !isHidden &&
          <Typography
          variant="caption"
          classes={{ caption: styles.smMessage }}>
          Copied
          </Typography>
        }
      </span>
    )
  }
}

EthAddress.propTypes = {
  address: PropTypes.string.isRequired,
  copyToClipboard: PropTypes.bool
}

export default EthAddress
