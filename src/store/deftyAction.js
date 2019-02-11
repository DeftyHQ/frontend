import { setCups } from './makerAction'

export const DEFTY = {
  PROOF_START: "DEFTY_PROOF_START",
  PROOF_ERROR: "DEFT_PRROF_ERROR",
  PROOF_SUCCESS: "DEFTY_PROOF_SUCCESS",
  TRANSFER_START: "DEFTY_TRANSFER_START",
  TRANSFER_ERROR: "DEFT_TRANSFER_ERROR",
  TRANSFER_SUCCESS: "DEFTY_TRANSFER_SUCCESS",
  WRAP_START: "DEFT_WRAP_START",
  WRAP_ERROR: "DEFT_WRAP_ERROR",
  WRAP_SUCCESS: "DEFTY_WRAP_SUCCESS",
  UNWRAP_START: "DEFT_UNWRAP_START",
  UNWRAP_ERROR: "DEFT_UNWRAP_ERROR",
  UNWRAP_SUCCESS: "DEFTY_UNWRAP_SUCCESS",
}

export const STATUS = {
  PROOF_LOADING: 'PROOF_LOADING',
  PROOF_FINSIHED: 'PROOF_FINSIHED',
  TRANSFER_LOADING: 'TRANSFER_LOADING',
  TRANSFER_FINISHED: 'TRANSFER_FINISHED',
  WRAP_LOADING: 'WRAP_LOADING',
  WRAP_FINISHED: 'WRAP_FINISHED'
}

export const proveOwnership = (cup) => {
  return async (dispatch, getState) => {
    const { system } = getState().maker
    const { address } = getState().network
    const { id } = cup.cupData
    dispatch({
      type: DEFTY.PROOF_START,
      cup: {
        ...cup
      }
    })
    try {
      await system.proveOwnership(id, address)
      dispatch({
        type: DEFTY.PROOF_SUCCESS,
        cup: {
          ...cup
        }
      })
    } catch (err) {
      console.warn('actions', err)
      dispatch({ type: DEFTY.PROOF_ERROR, err })
    }
  }
}

export const transferOwnership = (cup) => {
  return async (dispatch, getState) => {
    const { system } = getState().maker
    const { address } = getState().network
    const { id } = cup.cupData
    dispatch({
      type: DEFTY.TRANSFER_START
    })
    try {
      await system.transferOwnership(id, address)
      dispatch({ type: DEFTY.TRANSFER_SUCCESS })
    } catch (err) {
      console.warn('actions', err)
      dispatch({ type: DEFTY.TRANSFER_ERROR })
    }
  }
}

export const wrap = (cup) => {
  return async (dispatch, getState) => {
    const { system } = getState().maker
    const { address } = getState().network
    const { id } = cup.cupData
    dispatch({ type: DEFTY.WRAP_START })
    try {
      await system.wrap(id, address)
      dispatch({ type: DEFTY.WRAP_SUCCESS })
      // Refresh cups
      dispatch(setCups(address))
    } catch (err) {
      console.warn('actions', err)
      dispatch({ type: DEFTY.WRAP_ERROR })
    }
  }
}

export const unWrap = (cup) => {
  return async (dispatch, getState) => {
    const { system } = getState().maker
    const { address } = getState().network
    const { nft } = cup
    dispatch({
      type: DEFTY.UNWRAP_START
    })
    try {
      await system.unwrap(nft, address)
      dispatch({ type: DEFTY.UNWRAP_SUCCESS })
    } catch (err) {
      console.warn('actions', err)
      dispatch({ type: DEFTY.UNWRAP_ERROR })
    }
  }
}
