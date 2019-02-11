import React from 'react'
import PropTypes from 'prop-types'

import {
  Button,
  Paper,
  Fade,
  CircularProgress,
  Typography
} from '@material-ui/core'

import styles from './styles.module.css'

class StepsUnWrap extends React.Component {
  state = {
    isLoading: false
  }

  onClick = async () => {
    const { onClick, cup } = this.props
    this.setState({ isLoading: true })
    await onClick(cup)
    this.setState({ isLoading: false })
  }

  render = () => (
    <Paper className={styles.unwrap}>
      <Typography variant="h6" id="modal-title" gutterBottom>
         CDP #{this.props.cup ? this.props.cup.cupData.id : ''}
      </Typography>
      <Typography>This action will cancel all open trades for this CDP.</Typography>
      <Typography>If you want to trade this CDP in the future you will need to wrap it again.</Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={this.onClick}>
        <Fade
           in={this.state.isLoading}
           style={{ transitionDelay: this.state.isLoading ? '300ms' : '0ms' }}
           unmountOnExit>
           <CircularProgress size={16} color="secondary" className={styles.progress} />
         </Fade>
        UnWrap
      </Button>
    </Paper>
  )
}

StepsUnWrap.propTypes = {
  cup: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}


export default StepsUnWrap
