
import * as blockchain from 'api/blockchain'

export const NETWORK = {
  START: 'NETWORK_CONNECTION_START',
  PENDING: 'NETWORK_CONNECTION_PENDING',
  SUCCESS: 'NETWORK_CONNECTION_SUCCESS',
  REFUSED: 'NETWORK_CONNECTION_REFUSED',
  IMPOSSIBLE: 'NETWORK_CONNECTION_IMPOSSIBLE',
  ERROR: 'NETWORK_CONNECTION_ERROR',
  ACCOUNT_CHANGE: 'NETWORK_ACCOUNT_CHANGE'
}

export function initNetwork() {
  return async (dispatch) => {
    dispatch({
      type: NETWORK.START
    })

    try {
      const web3 = await blockchain.setWebClientWeb3();
      await blockchain.setWebClientProvider(web3);

      const accounts = await blockchain.getAccounts()
      const address = accounts[0]
      // const network = web3.version.network

      dispatch({
        type: NETWORK.SUCCESS,
        payload: {
          address,
          accounts,
          // network,
          web3
        }
      })
    } catch(err) {
      dispatch({
        type: NETWORK.ERROR,
        err
      })
    }
  }
}

// export function accountChange(newAddress) {
//   return (dispatch) => {
//     dispatch({
//       type: AUTH.ACCOUNT_CHANGE,
//       payload: { address: newAddress }
//     })
//   }
// }
