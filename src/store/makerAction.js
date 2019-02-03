import Maker from '@makerdao/dai'
import { fetchCups } from 'api'

export const MKR = {
  INIT_START: 'MKR_INIT_START',
  INIT_PENDING: 'MKR_INIT_PENDING',
  INIT_SUCCESS: 'MKR_INIT_SUCCESS',
  INIT_ERROR: 'MKR_INIT_ERROR',
  CUPS_SUCCESS: 'MKR_CUPS_SUCCESS',
  CUPS_ERROR: 'MKR_CUPS_ERROR'
}

export function initMaker() {
  return async (dispatch) => {
    const maker = new Maker('browser')
    try {
      await maker.authenticate()
      dispatch({
        type: MKR.INIT_SUCCESS,
        payload: { instance: maker }
      })
    } catch (err) {
      dispatch({
        type: MKR.INIT_ERROR,
        payload: { err }
      })
    }
  }
}

export function getCups(account, proxy) {
  return async (dispatch, getState) => {
    const raw = await fetchCups(account, proxy)
    const { instance } = getState().maker
    try {
      const cups = await Promise.all(
        raw.map(async cup => getCupDetails(cup, instance))
      )
      dispatch({
        type: MKR.CUPS_SUCCESS,
        payload: { cups }
      })
    } catch(err) {
      dispatch({
        type: MKR.CUPS_ERROR,
        payload: { err }
      })
    }
  }
}

async function getCupDetails(node, maker) {
  const cdp = await maker.getCdp(node.id)
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
}
