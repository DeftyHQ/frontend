import { NETWORK } from './networkAction'

export default (
  state = {
    status: '',
    address: 'empty',
    web3: {}
  },
  action
) => {
  switch (action.type) {
    case NETWORK.SUCCESS:
      return {
        ...state,
        status: 'NETWORK_SUCCESS',
        web3: action.payload.web3,
        accounts: action.payload.accounts,
        address: action.payload.address,
        network: action.payload.network
      }
    case NETWORK.PENDING:
      return {
        ...state,
        status: 'NETWORK_PENDING'
      }
    case NETWORK.REFUSED:
      return {
        ...state,
        status: 'NETWORK_REFUSED'
      }
    case NETWORK.START:
      return {
        ...state,
        status: 'NETWORK_START'
      }
    case NETWORK.IMPOSSIBLE:
      return {
        ...state,
        status: 'NETWORK_FAILED'
      }
    case NETWORK.ERROR:
      return {
        ...state,
        err: action.err,
        status: 'NETWORK_ERROR'
      }
    case NETWORK.ACCOUNT_CHANGE:
      return {
        ...state,
        address: action.payload.address
      }
    default:
      return state
  }
}
