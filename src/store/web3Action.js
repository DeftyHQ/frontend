import Web3 from "web3"
async function getAccounts(web3) {

  const accounts = await web3.eth.getAccounts()
  return {
    web3,
    accounts,
    address: accounts[0]
  }
}

export const AUTH = {
  START: 'WEB3_CONNECTION_START',
  PENDING: 'WEB3_CONNECTION_PENDING',
  SUCCESS: 'WEB3_CONNECTION_SUCCESS',
  REFUSED: 'WEB3_CONNECTION_REFUSED',
  IMPOSSIBLE: 'WEB3_CONNECTION_IMPOSSIBLE',
  ACCOUNT_CHANGE: 'WEB3_ACCOUNT_CHANGE'
}

export function initWeb3({ web3, address, accounts }) {
  return async (dispatch) => {
    dispatch({
      type: AUTH.SUCCESS,
      payload: {
        address,
        accounts,
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

export function initWeb3Old() {
  return async (dispatch) => {
    dispatch({ type: AUTH.START })
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        dispatch({ type: AUTH.PENDING })
        await window.ethereum.enable();
        // Acccounts now exposed
        console.log("Modern web3 detected.");

        dispatch({
          type: AUTH.SUCCESS,
          payload: await getAccounts(web3)
        })
      } catch (error) {
        dispatch({ type: AUTH.REFUSED })
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      const web3 = window.web3;
      console.log("Legacy web3 detected.");
      dispatch({
        type: AUTH.SUCCESS,
        payload: getAccounts(web3)
      })
    }
    // Fallback to localhost; use dev console port by default...
    else {
      // const provider = new Web3.providers.HttpProvider(
      //   "http://127.0.0.1:9545"
      // );
      // const web3 = new Web3(provider);
      // console.log("No web3 instance injected, using Local web3.");
      dispatch({ type: AUTH.IMPOSSIBLE })
    }
  }
}
