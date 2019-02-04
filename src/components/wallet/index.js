import React from 'react'
import { connect } from 'react-redux'
import Blockies from 'react-blockies'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { getWeb3 } from 'api'
import { initWeb3, accountChange } from 'store/web3Action'
import { Account, CdpCard } from 'components'

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
    const classes = {}

    return list.map((cup, i) => {
      const { expanded } = this.state
      const key = `panel${i}`
      return (
        <div key={i}>
          <ExpansionPanel
            expanded={expanded === key}
            onChange={this.handleChange(key)}>
           <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
             <Typography className={classes.heading}>CDP #{cup.id}</Typography>
             <Typography className={classes.secondaryHeading}></Typography>
           </ExpansionPanelSummary>
           <ExpansionPanelDetails>
             <Typography>Collateral {cup.ink}</Typography>
             <div>
               <pre key={i}>{JSON.stringify(cup, null, 2)}</pre>
             </div>
           </ExpansionPanelDetails>
         </ExpansionPanel>
        </div>
      )
    })
  }

  render() {
    const { cups, address, network, initWeb3 } = this.props
    return (
      <div>
        <Account address={address} network={network}/>
        <div>
          <h3>My CDP's</h3>
          { this.displayList(cups) }
        </div>
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
