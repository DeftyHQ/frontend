
export const AUTH = {
  START: 'WEB3_CONNECTION_START',
  PENDING: 'WEB3_CONNECTION_PENDING',
  SUCCESS: 'WEB3_CONNECTION_SUCCESS',
  REFUSED: 'WEB3_CONNECTION_REFUSED',
  IMPOSSIBLE: 'WEB3_CONNECTION_IMPOSSIBLE',
  ACCOUNT_CHANGE: 'WEB3_ACCOUNT_CHANGE'
}

export function initWeb3({ web3, address, accounts, network }) {
  return (dispatch) => {
    dispatch({
      type: AUTH.SUCCESS,
      payload: {
        address,
        accounts,
        network,
        web3
      }
    })
  }
}

export function accountChange(newAddress) {
  return (dispatch) => {
    dispatch({
      type: AUTH.ACCOUNT_CHANGE,
      payload: { address: newAddress }
    })
  }
}
