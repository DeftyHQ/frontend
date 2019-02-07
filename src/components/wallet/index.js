import React from 'react'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import NumberFormat from 'react-number-format';
import {
  Modal,
  Button,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Typography
} from '@material-ui/core'

import {
  Account,
  WrapSteps,
} from 'components'

import styles from './styles.module.css'

class Wallet extends React.Component {
  state = {
    expanded: null,
    modalOpen: false,
    modalCup: null,
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
      const isLegacy = cup.type === "legacy"
      const key = `panel${i}`
      return (
        <ExpansionPanel
          key={key}
          expanded={expanded === key}
          onChange={this.handleChange(key)}
          className={ isLegacy ? styles.legacy : ''}>
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
           {
             cup.status === 'wrapped'
               ? <Button size="small">Unwrap</Button>
               : <Button size="small" color="primary" onClick={() => this.handleOpen(cup)}>Wrap</Button>
           }
         </ExpansionPanelActions>
       </ExpansionPanel>
      )
    })
  }

  render() {
    const { cups, address, network, isLoading } = this.props
    return (
      <div className={styles.fullHeight}>
        <Account address={address} network={network}/>
        <section className={styles.stretch}>
          <div className={styles.listHeader}>
            <Typography variant="subtitle1">My CDP's</Typography>
          </div>
          <div className={styles.stretch}>
          {
            isLoading
            ? <div className={styles.progress}>
                <CircularProgress />
              </div>
            : <div className={styles.listBody}>
                {this.displayList(cups)}
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.modalOpen}
                onClose={this.handleClose.bind(this)}
                style={{ display: 'flex', alignItems:'center', justifyContent:'center' }}>
                <WrapSteps
                  cup={this.state.modalCup}
                  onCompletion={this.handleClose.bind(this)}/>
              </Modal>
              </div>
          }
          </div>
        </section>
      </div>
    )
  }
}


export default Wallet
