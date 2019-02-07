import Maker from '@makerdao/dai'

import { System } from 'lib/scd/system'

export const MKR = {
  INIT_START: 'MKR_INIT_START',
  INIT_PENDING: 'MKR_INIT_PENDING',
  INIT_SUCCESS: 'MKR_INIT_SUCCESS',
  INIT_ERROR: 'MKR_INIT_ERROR',
  CUPS_START: 'MKR_CUPS_START',
  CUPS_SUCCESS: 'MKR_CUPS_SUCCESS',
  CUPS_ERROR: 'MKR_CUPS_ERROR'
}

export function initSystem() {
  return async (dispatch) => {
    dispatch({ type: MKR.INIT_START })
    try {
      const instance = new Maker('browser')
      await instance.authenticate()
      const system = new System()

      dispatch({
        type: MKR.INIT_SUCCESS,
        payload: {
          system,
          instance,
        }
      })
    } catch (err) {
      dispatch({
        type: MKR.INIT_ERROR,
        payload: { err }
      })
    }
  }
}

export function setCups(lad) {
  return async (dispatch, getState) => {
    dispatch({ type: MKR.CUPS_START })
    const { system, instance } = getState().maker
    const proxy = await instance.service('proxy').getProxyAddress()
    let promiseCups = []
    try {
      const legacyCups = await system.getCupsFromApi(lad, proxy)
      const newCups = await system.getCupsFromChain(proxy)
      promiseCups = [...legacyCups, ...newCups]
    } catch(err) {
      console.error('Error in setCups():', err)
      dispatch({
        type: MKR.CUPS_ERROR,
        payload: { err }
      })
    } finally {
      const cups = await Promise.all(promiseCups)
        .then(cups => filterCups(cups, lad, proxy))
        .then(cups => setType(cups, lad, proxy))
        // @TODO: double request with system.getCups...
        // should remove once we determine which info and format
        // we really want for a cup.
        .then(cups => {
          const promises = cups.map(cup => getCupDetails(cup, instance))
          return Promise.all(promises)
        })

      dispatch({
        type: MKR.CUPS_SUCCESS,
        payload: { cups }
      })
    }
  }
}

/* Action Helpers */

function filterCups(cups, lad, proxy) {
  const isOwner = cup =>  {
    const currentOwner = cup.cupData.lad.toLowerCase()
    return currentOwner === lad.toLowerCase() || currentOwner === proxy.toLowerCase()
  }
  return cups.filter(isOwner)
}

function setType(cups, lad, proxy) {
  return cups.map(cup => {
    let type;
    const owner = cup.cupData.lad.toLowerCase()
    if (owner === lad.toLowerCase()) {
      type = "legcay"
    } else if (owner === proxy.toLowerCase()) {
      type = "new"
    }
    cup.type = type
    return cup
  })
}

async function getCupDetails(node, maker) {
  const cdp = await maker.getCdp(node.cupData.id)
  return Promise.all([
    cdp.getDebtValue(Maker.USD),
    cdp.getCollateralValue(),
    cdp.getCollateralizationRatio(),
    cdp.getLiquidationPrice(),
    cdp.isSafe()
  ]).then(([debtValue, collateralValue, collateralizationRatio, liquidationPrice, isSafe]) => {
    return {
      ...node,
      debtValue,
      collateralValue,
      collateralizationRatio,
      liquidationPrice,
      isSafe
    }
  })

  // {
  //   "block": 10299252,
  //   "cupData": {
  //     "id": 4832,
  //     "lad": "0x909f74ffdc223586d0d30e78016e707b6f5a45e2",
  //     "safe": false,
  //     "ink": "999843601236543264",
  //     "art": "73000000000000000000",
  //     "ire": "72000547669429963994",
  //     "ratio": "1.413835616438356164",
  //     "avail_dai": "0",
  //     "avail_skr": "0",
  //     "avail_eth": "0",
  //     "liq_price": "109499999999999999997"
  //   },
  //   "type": "legcay",
  //   "debtValue": {
  //     "_amount": "73",
  //     "symbol": "USD"
  //   },
  //   "collateralValue": {
  //     "_amount": "0.9999999999999999513946985976163104",
  //     "symbol": "ETH"
  //   },
  //   "collateralizationRatio": 1.413835616438356,
  //   "liquidationPrice": {
  //     "_amount": "109.50000000000000532228",
  //     "symbol": "USD/ETH"
  //   },
  //   "isSafe": true
  // }
}
