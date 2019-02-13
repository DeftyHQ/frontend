import React from 'react'
import PropTypes from 'prop-types'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import NumberFormat from 'react-number-format';
import {
  Button,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography
} from '@material-ui/core'

import { CUP_TYPES } from 'store/makerAction'
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

  cupAction(cup) {
    const { action, actionTitle } = this.props
    // if (cup.type === CUP_TYPES.MODERN) {
    //   return (
    //     <div className={styles.newCupAction}>
    //      <div>
    //       <Typography variant="caption">This is CDP belongs to your proxy</Typography>
    //       <Typography variant="caption">You will soon be able to wrap it!</Typography>
    //      </div>
    //       <Button
    //         size="small"
    //         color="primary"
    //         variant="outlined"
    //         disabled
    //         onClick={
    //           () => {
    //             this.action(cup)
    //           }
    //         }>
    //         Wrap
    //       </Button>
    //     </div>
    //   )
    // }

    return (
      <Button
        size="small"
         color="primary"
         onClick={() => action(cup)}>
         { actionTitle }
      </Button>
    )
  }

  render() {
    const { cup, index } = this.props
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
          {/*<Typography>
            <span className={styles.name}>Collateral</span>
            <NumberFormat
              value={cup.ink}
              displayType={'text'}
              decimalScale={2}
              fixedDecimalScale={true}
              thousandSeparator={true}
              isNumericString/>
          </Typography>
          <Typography>
            <span className={styles.name}>Ratio</span>
            <NumberFormat
              value={cup.ratio}
              displayType={'text'}
              decimalScale={2}
              fixedDecimalScale={true}
              thousandSeparator={true}
              isNumericString/>
          </Typography>
          <Typography>
            <span className={styles.name}>Art</span>
            <span className={styles.value}>{cup.art}</span>
          </Typography>*/}
          <Typography>
            <span className={styles.name}>Debt value</span>
            {/*<span className={styles.value}>{cup.debtValue.toString()}</span>*/}
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
         { this.cupAction(cup) }
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
