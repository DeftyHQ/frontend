import { getCups } from 'api'

export const MKR = {
  GET_CUPS: 'MKR_GET_CUPS'
}

export function getUserCups(address) {
  return async (dispatch) => {
    const cups = await getCups(address)
    console.log('cups', address, cups)
    dispatch({
      type: MKR.GET_CUPS,
      payload: cups
    })
  }
}
