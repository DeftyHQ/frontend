import uniqBy from 'lodash.uniqby'
import Maker from '@makerdao/dai'

import { System } from 'lib/scd/system'
import * as blockchain from '../lib/scd/utils/blockchain'

export const CUP_TYPES = {
  WRAPPED: 'WRAPPED',
  LEGACY: 'LEGACY',
  MODERN: 'MODERN'
}

export const MKR = {
  INIT_START: 'MKR_INIT_START',
  INIT_PENDING: 'MKR_INIT_PENDING',
  INIT_SUCCESS: 'MKR_INIT_SUCCESS',
  INIT_ERROR: 'MKR_INIT_ERROR',
  CUPS_START: 'MKR_CUPS_START',
  CUPS_SUCCESS: 'MKR_CUPS_SUCCESS',
  CUPS_ERROR: 'MKR_CUPS_ERROR',
  NFT_FILTER: 'NFT_GET_WRAPPED'
}

export function initSystem(window) {
  return async (dispatch) => {
    dispatch({ type: MKR.INIT_START })
    try {
      const system = new System()
      const instance = new Maker('browser')
      await instance.authenticate()

      // Use window to pass instance, since store triggers
      // Symbol to string Error
      const proxyAddr = await instance.service('proxy').getProxyAddress();
      window.MAKER = { instance }


      dispatch({
        type: MKR.INIT_SUCCESS,
        payload: {
          system,
          proxyAddr
          // instance,
        }
      })
    } catch (err) {
      console.warn('initSystem:', err)
      dispatch({
        type: MKR.INIT_ERROR,
        payload: { err }
      })
    }
  }
}

export function setCups(lad, window) {
  return async (dispatch, getState) => {
    dispatch({ type: MKR.CUPS_START })
    const { system, proxyAddr } = getState().maker

    let promiseCups = []
    try {
      const legacyCups = await system.getCupsFromApi(lad)
      const newCups = await system.getCupsFromChain(proxyAddr)
      promiseCups = [...legacyCups, ...newCups ]
    } catch(err) {
      console.debug('Error in setCups():', err)
      dispatch({
        type: MKR.CUPS_ERROR,
        payload: { err }
      })
    } finally {


      // @TODO
      // Refactor fetching defty cups
      // Triggers warning: EventEmitter leak!!!
      let wrappedCups = [];
      let nft;
      const defty = blockchain.objects.deftyWrap.address;
      try {
        nft = await system.getNFTs(lad, lad)
        wrappedCups = await system.getCupByToken(nft, lad)
      } catch (err) {
        console.debug('User has no Wrapped cups')
      }

      promiseCups = [ ...promiseCups, ...wrappedCups ]

      const cups = await Promise.all(promiseCups)
        .then(cups => filterCups(cups, lad, proxyAddr, defty))
        .then(cups => setType(cups, lad, proxyAddr, defty, nft))
        // @TODO: double request with system.getCups...
        // should remove once we determine which info and format
        // we really want for a cup.
        .then(cups => uniqBy(cups, 'id'))
        .then(cups => {
          const promises = cups.map(cup => getCupDetails(cup, window.MAKER.instance))
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
function filterCups(cups, lad, proxy, defty) {
  const isOwner = cup =>  {
    const currentOwner = cup.cupData.lad.toLowerCase()
    return (
         currentOwner === lad.toLowerCase()
      || currentOwner === proxy.toLowerCase()
      || currentOwner === defty.toLowerCase()
    )
  }
  return cups.filter(isOwner)
}

function setType(cups, lad, proxy, defty, nftId) {
  return cups.map(cup => {
    let type;
    const owner = cup.cupData.lad.toLowerCase()
    if (owner === lad.toLowerCase()) {
      type = CUP_TYPES.LEGACY
    } else if (owner === proxy.toLowerCase()) {
      type = CUP_TYPES.MODERN
    } else if (owner === defty.toLowerCase()) {
      type = CUP_TYPES.WRAPPED
      cup.nftId = nftId
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
  //   "type": CUP_TYPES.LEGACY,
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
