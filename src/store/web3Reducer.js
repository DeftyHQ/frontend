import { AUTH } from './web3Action'

export default (
  state = {
    status: '',
    address: 'empty',
    web3: {}
  },
  action
) => {
  switch (action.type) {
    case AUTH.SUCCESS:
      return {
        ...state,
        status: 'AUTH_SUCCESS',
        web3: action.payload.web3,
        accounts: action.payload.accounts,
        address: action.payload.address
      }
    case AUTH.PENDING:
      return {
        ...state,
        status: 'AUTH_PENDING'
      }
    case AUTH.REFUSED:
      return {
        ...state,
        status: 'AUTH_REFUSED'
      }
    case AUTH.START:
      return {
        ...state,
        status: 'AUTH_START'
      }
    case AUTH.IMPOSSIBLE:
      return {
        ...state,
        status: 'AUTH_FAILED'
      }
    case AUTH.ACCOUNT_CHANGE:
      return {
        ...state,
        address: action.payload.address
      }
    default:
      return state
  }
}
