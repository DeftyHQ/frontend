import React from 'react'
import PropTypes from 'prop-types'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import NumberFormat from 'react-number-format';
import {
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography
} from '@material-ui/core'

import styles from './styles.module.css'

class CupPanel extends React.Component {
  state = {
    expanded: false
  }

  handleChange(panelId) {
    return (event, expanded) => {
      this.setState({
        expanded: expanded ? panelId : false,
      })
    }
  }

  render() {
    const { cup, index, action, actionTitle } = this.props
    const { expanded } = this.state

    return (
      <ExpansionPanel
        key={index}
        expanded={expanded === index}
        onChange={this.handleChange(index)}>
       <ExpansionPanelSummary
          className={styles.cardSummary}
          expandIcon={<ExpandMoreIcon />}>
         <Typography
            className={cup.isSafe ? styles.safe : styles.unsafe}>
            #{cup.cupData.id}
          </Typography>
          <Typography>{cup.collateralValue.toString()}</Typography>
       </ExpansionPanelSummary>
       <ExpansionPanelDetails
          className={styles.cardContent}>
          <Typography>
            <span className={styles.name}>Debt value</span>
            <NumberFormat
              value={cup.debtValue.toString()}
              displayType={'text'}
              thousandSeparator={true}
              isNumericString/>
          </Typography>
          <Typography>
            <span className={styles.name}>Collateralization ratio</span>
            <NumberFormat
              value={cup.collateralizationRatio.toString()}
              displayType={'text'}
              decimalScale={2}
              suffix={" %"}
              fixedDecimalScale={true}
              thousandSeparator={true}
              isNumericString/>
          </Typography>
          <Typography>
            <span className={styles.name}>Collateral value</span>
            <span className={styles.value}>{cup.collateralValue.toString()}</span>
          </Typography>
          <Typography>
            <span className={styles.name}>Liquidation Price</span>
            <span className={styles.value}>{cup.liquidationPrice.toString()}</span>
          </Typography>
       </ExpansionPanelDetails>
       <ExpansionPanelActions>
         <Button
           size="small"
            color="primary"
            onClick={() => action(cup)}>
            { actionTitle }
         </Button>
       </ExpansionPanelActions>
     </ExpansionPanel>
    )
  }
}

CupPanel.propTypes = {
  cup: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  action: PropTypes.func.isRequired,
  actionTitle: PropTypes.string.isRequired
}

export default CupPanel
