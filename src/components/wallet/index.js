import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import NumberFormat from 'react-number-format';

import { accountChange } from 'store/web3Action'
import { Account, CdpCard } from 'components'
import styles from './styles.module.css'

class Wallet extends React.Component {
  state = {
    expanded: null,
  }

  handleChange(panelId) {
    return (event, expanded) => {
      this.setState({
        expanded: expanded ? panelId : false,
      })
    }
  }

  displayList(list) {

    return list.map((cup, i) => {
      const { expanded } = this.state
      const key = `panel${i}`
      return (
        <ExpansionPanel
          key={key}
          expanded={expanded === key}
          onChange={this.handleChange(key)}>
         <ExpansionPanelSummary
            className={styles.cardSummary}
            expandIcon={<ExpandMoreIcon />}>
           <Typography
              className={cup.isSafe ? styles.safe : styles.unsafe}>
              #{cup.id}
            </Typography>
            <Typography>{cup.collateralValue.toString()}</Typography>
         </ExpansionPanelSummary>
         <ExpansionPanelDetails
            className={styles.cardContent}>
            <Typography>
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
                value={cup.ratio.toString()}
                displayType={'text'}
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={true}
                isNumericString/>
            </Typography>
            <Typography>
              <span className={styles.name}>Art</span>
              <span className={styles.value}>{cup.art}</span>
            </Typography>
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
           {
             cup.status === 'wrapped'
               ? <Button size="small">Unwrap</Button>
               : <Button size="small" color="primary">Wrap</Button>
           }
         </ExpansionPanelActions>
       </ExpansionPanel>
      )
    })
  }

  render() {
    const { cups, address, network } = this.props
    return (
      <div>
        <Account address={address} network={network}/>
        <section>
          <div className={styles.listHeader}>
            <Typography variant="subtitle1">My CDP's</Typography>
          </div>
          <div className={styles.listBody}>
            { this.displayList(cups) }
          </div>
        </section>
      </div>
    )
  }
}


const mapStateToProps = ({ auth, maker }) => {
  return ({
    cups: maker.cups,
    accounts: auth.accounts,
    address: auth.address,
    network: auth.network
  })
}

const mapDispatchToProps = dispatch => ({
  accountChange: (address) => dispatch(accountChange(address)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
