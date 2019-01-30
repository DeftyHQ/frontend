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
import { getUserCups } from 'store/cupsAction'
import { initWeb3, accountChange } from 'store/web3Action'

class Wallet extends React.Component {
  state = {
    expanded: null,
  }

  async getAccounts(web3) {
    const accounts = await web3.eth.getAccounts()
    return {
      web3,
      accounts,
      address: accounts[0]
    }
  }

  async componentWillMount() {
    // First run ask for Metamask authorization
    // - we should load the page before asking
    // - also it will not work on address or network change so we should
    // create an action that can be dispatched at the appropriate moment.
    try {
      const web3 = await getWeb3()
      const auth = await this.getAccounts(web3)
      await this.props.initWeb3(auth)
      await this.props.getUserCups(auth.address)
      // web3.currentProvider.publicConfigStore.on('update', async (data) => {
      //   const address = data.selectedAddress
      //   if (address !== this.props.address) {
      //     console.log('change', address, this.props.address)
      //     await this.props.getUserCups(data.selectedAddress)
      //     this.props.accountChange(address)
      //   }
      // });
    } catch(err) {
      console.warn('Failed to initWeb3', err)
    }

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
      return (
        <div>
          <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
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
         <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
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
    const { cups, address, initWeb3 } = this.props
    return (
      <div>
        <div>
          <Blockies style="{ border-radius: 50% }" seed={this.props.address} />
          { address }
        </div>
        <div>
          <h3>My CDP's</h3>
          { this.displayList(cups) }
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ cups, auth }) => {
  return ({
    cups: cups.cups,
    accounts: auth.accounts,
    address: auth.address,
  })
}

const mapDispatchToProps = dispatch => ({
  accountChange: (address) => dispatch(accountChange(address)),
  initWeb3: (auth) => dispatch(initWeb3(auth)),
  getUserCups: (address) => dispatch(getUserCups(address))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)
